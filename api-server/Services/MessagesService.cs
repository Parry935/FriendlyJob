using api_server.Database;
using api_server.Entities;
using api_server.Exceptions;
using api_server.Interfaces.Services;
using api_server.Models.DTOs;
using api_server.Models.DTOs.CreateDTOs;
using api_server.Utility;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Services
{
    public class MessagesService : IMessagesService
    {
        private readonly AppDbContext _db;
        private readonly IUserContextService _userContextService;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public MessagesService(AppDbContext db, IUserContextService userContextService, IMapper mapper, IEmailService emailService)
        {
            _db = db;
            _userContextService = userContextService;
            _mapper = mapper;
            _emailService = emailService;
        }

        public async Task<MessageDto> CreateMessageAsync(CreateMessageDto createMessageDto)
        {
            if (createMessageDto.SenderId is null)
                createMessageDto.SenderId = _userContextService.GetUserId;

            if (createMessageDto.RecipientId is null)
                throw new BadRequestException();

            if (createMessageDto.RecipientId == createMessageDto.SenderId)
                throw new BadRequestException();
            
            if(_db.Users.Where(m => m.Id == createMessageDto.SenderId || m.Id == createMessageDto.RecipientId).Count() != 2)
                throw new BadRequestException();

            var message = new Message()
            {
                Content = createMessageDto.Content,
                Date = DateTime.Now,
                Readed = false,
                SenderId = (int)createMessageDto.SenderId,
                RecipientId = (int)createMessageDto.RecipientId
            };

            //await SendNotificationAsync(message.SenderId, message.RecipientId);

            _db.Messages.Add(message);
            await _db.SaveChangesAsync();

            return _mapper.Map<MessageDto>(message);
        }

        private async Task SendNotificationAsync(int senderId, int recipientId)
        {
            var message = await _db.Messages
                .Where(m => m.SenderId == senderId && m.RecipientId == recipientId)
                .OrderByDescending(m => m.Date)
                .FirstOrDefaultAsync();

            if(message is null || message.Readed == true)
            {
                var sender = await _db.Users.Include(m => m.Company).FirstOrDefaultAsync(m => m.Id == senderId);
                var recipient = await _db.Users.FirstOrDefaultAsync(m => m.Id == recipientId);

                if(sender is null || recipient is null)
                    throw new NotFoundException();

                if (sender.Company is not null)
                    _emailService.SendEmailNewMessage(recipient.Email, sender.Company.Name);

                else
                    _emailService.SendEmailNewMessage(recipient.Email, $"{sender.FirstName} {sender.LastName}");
            }
        }

        public async Task<IEnumerable<ConversationDto>> GetConversationsAsync(int page)
        {
            if (page <= 0)
                throw new BadRequestException();

            var userId = _userContextService.GetUserId;

            var messages = await _db.Messages
                .Where(m => m.SenderId == userId || m.RecipientId == userId)
                .OrderByDescending(m => m.Date)
                .ToListAsync();

            var usersId = new List<int>();
            int idTemp;
            var conversations = new List<ConversationDto>();

            foreach (var item in messages)
            {
                if (page * AppConfiguration.pageSize <= usersId.Count())
                    break;

                if (item.SenderId == userId)
                    idTemp = item.RecipientId;
                else
                    idTemp = item.SenderId;

                if (usersId.Contains(idTemp))
                    continue;
                else
                {
                    usersId.Add(idTemp);

                    var user = await _db.Users.Include(m => m.Company).Include(m => m.Role).FirstOrDefaultAsync(m => m.Id == idTemp);

                    if (user is not null)
                    {
                        conversations.Add(new ConversationDto()
                        {
                            Date = item.Date.ToString(),
                            LastContent = item.Content,
                            RecipientId = item.RecipientId,
                            Readed = item.Readed,
                            User = _mapper.Map<UserWithCompanyDto>(user)
                        });
                    }
                }
            }

            return conversations.Skip(AppConfiguration.pageSize * (page - 1)).Take(AppConfiguration.pageSize).ToList();
        }

        public async Task<IEnumerable<MessageDto>> GetMessagesAsync(int? sender, int? recipient)
        {
            if (sender is null || recipient is null)
                throw new BadRequestException();

            _userContextService.CheckAccessByUserId((int)sender);

            if (sender == recipient)
                throw new BadRequestException();

            var messages = await _db.Messages
                .Where(m => (m.SenderId == sender && m.RecipientId == recipient) || (m.SenderId == recipient && m.RecipientId == sender))
                .OrderByDescending(m => m.Date)
                .ToListAsync();

            foreach (var item in messages)
            {
                if (item.SenderId == recipient && item.RecipientId == sender)
                    item.Readed = true;
            }

            await _db.SaveChangesAsync();

            return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task DeleteMessageAsync(int id)
        {
            var message = await _db.Messages.FindAsync(id);

            if (message is null)
                throw new NotFoundException();

            _userContextService.CheckAccessByUserId(message.SenderId);

            _db.Messages.Remove(message);
            await _db.SaveChangesAsync();
        }

        public async Task EditMessageAsync(int id, string content)
        {
            var message = await _db.Messages.FindAsync(id);

            if (message is null)
                throw new NotFoundException();

            _userContextService.CheckAccessByUserId(message.SenderId);

            message.Content = content;
            await _db.SaveChangesAsync();
        }
    }
}
