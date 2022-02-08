using api_server.Models.DTOs;
using api_server.Models.DTOs.CreateDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Interfaces.Services
{
    public interface IMessagesService
    {
        Task<MessageDto> CreateMessageAsync(CreateMessageDto createMessageDto);

        Task<IEnumerable<MessageDto>> GetMessagesAsync(int? sender, int? recipient);

        Task<IEnumerable<ConversationDto>> GetConversationsAsync(int page);
        Task DeleteMessageAsync(int id);
        Task EditMessageAsync(int id, string content);
    }
}
