using api_server.Database;
using api_server.Entities;
using api_server.Exceptions;
using api_server.Interfaces.Services;
using api_server.Models.DTOs;
using api_server.Models.DTOs.CreateDTOs;
using api_server.Utility;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Services
{
    public class JobApplicationsService : IJobApplicationsService
    {
        private readonly AppDbContext _db;
        private readonly IUserContextService _userContextService;
        private readonly IMapper _mapper;
        private readonly IMessagesService _messagesService;

        public JobApplicationsService(AppDbContext db, IUserContextService userContextService, IMapper mapper, IMessagesService messagesService)
        {
            _db = db;
            _userContextService = userContextService;
            _mapper = mapper;
            _messagesService = messagesService;
        }

        public async Task AddFileToJobApplicationAsync(int id, IFormFile file)
        {
            var jobApplication = await _db.JobApplications.FirstOrDefaultAsync(m => m.Id == id);

            if (jobApplication is null)
                throw new NotFoundException();

            _userContextService.CheckAccessByUserId(jobApplication.UserId);

            if (file == null || file.Length <= 0)
                throw new BadRequestException("Nie przesłano pliku");

            var rootPath = Directory.GetCurrentDirectory();
            var extension = Path.GetExtension(file.FileName);
            var fullPath = $"{rootPath}/Files/{jobApplication.Id}{extension}";
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            jobApplication.File = string.Concat(jobApplication.Id, extension);

            await _db.SaveChangesAsync();
        }

        public async Task<int> CreateJobApplcationAsync(CreateJobApplicationDto createJobApplication)
        {
            var jobOffer = await _db.JobOffers.FirstOrDefaultAsync(m => m.Id == createJobApplication.OfferId);

            if (jobOffer is null)
                throw new NotFoundException();

            var jobApplicationFromDb = await _db.JobApplications.FirstOrDefaultAsync(m => m.JobOfferId == createJobApplication.OfferId && m.UserId == (int)_userContextService.GetUserId);

            if (jobApplicationFromDb is not null)
                throw new BadRequestException("Twoja aplikacja jest już rozpatrywana na tę ofertę");

            var jobApplication = new JobApplication()
            {
                Description = createJobApplication.Description,
                Date = DateTime.Now,
                JobOfferId = createJobApplication.OfferId,
                UserId = (int)_userContextService.GetUserId,
            };

            _db.JobApplications.Add(jobApplication);
            await _db.SaveChangesAsync();

            return jobApplication.Id;
        }

        public async Task DeleteJobApplcationAsync(int id)
        {
            var jobApplication = await _db.JobApplications.Include(m => m.JobOffer).FirstOrDefaultAsync(m => m.Id == id);

            if (jobApplication is null)
                throw new NotFoundException();

            CheckAccessByJobApplication(jobApplication.Id);

            if(_userContextService.GetUserId != jobApplication.UserId)
                await GenerateMessageToProgrammerAsync(jobApplication);

            DeleteFileFromDirectoryIfExist(jobApplication.File);

            _db.JobApplications.Remove(jobApplication);
            await _db.SaveChangesAsync();
        }

        private void DeleteFileFromDirectoryIfExist(string fileName)
        {
            var rootPath = Directory.GetCurrentDirectory();
            var path = $"{rootPath}/Files";

            var files = Directory.GetFiles(path, fileName);

            foreach (var item in files)
            {
                if (System.IO.File.Exists(item))
                {
                    System.IO.File.Delete(item);
                }
            }
        }

        public byte[] GetFile(string fileName, out string contentType)
        {
            CheckAccessByJobApplication(int.Parse(fileName.Split('.')[0]));

            var rootPath = Directory.GetCurrentDirectory();

            var filePath = $"{rootPath}/Files/{fileName}";

            var fileExists = System.IO.File.Exists(filePath);
            if (!fileExists)
                throw new NotFoundException("Nie znaleziono CV dla aplikacji");

            var contentProvider = new FileExtensionContentTypeProvider();
            contentProvider.TryGetContentType(fileName, out string type);
            contentType = type;

            var fileData = System.IO.File.ReadAllBytes(filePath);

            return fileData;
        }

        public async Task<IEnumerable<JobApplicationDto>> GetJobApplicationsAsync(int jobOfferId, int userId, int page)
        {
            if((jobOfferId == 0 && userId == 0) || page <= 0)
                throw new BadRequestException();

            if(jobOfferId > 0)
              await CheckAccessByJobOffer(jobOfferId);

            if (userId > 0)
                _userContextService.CheckAccessByUserId(userId);

            var jobApplication = await _db.JobApplications
                .Include(m => m.User)
                .Where(m => (jobOfferId != 0 ? jobOfferId == m.JobOfferId : true) && (userId != 0 ? userId == m.UserId : true))
                .OrderByDescending(m => m.Date)
                .ToListAsync();

            jobApplication = jobApplication.Skip(AppConfiguration.pageSize * (page - 1)).Take(AppConfiguration.pageSize).ToList();

            return _mapper.Map<IEnumerable<JobApplicationDto>>(jobApplication);
        }

        private async Task GenerateMessageToProgrammerAsync(JobApplication jobApplication)
        {
            var contentMessage = AppConfiguration.autogeneratedMessage;

            contentMessage = contentMessage
                .Replace("TITLE", jobApplication.JobOffer.Title)
                .Replace("SIZE", jobApplication.JobOffer.Title.Length.ToString());

            var message = new CreateMessageDto()
            {
                RecipientId = jobApplication.UserId,
                Content = contentMessage
            };

            await _messagesService.CreateMessageAsync(message);
        }

        private async Task CheckAccessByJobOffer(int offerId)
        {
            var jobOffer = await _db.JobOffers
                .Include(m => m.Company)
                .ThenInclude(m => m.User)
                .FirstOrDefaultAsync(m => m.Id == offerId);

            if (jobOffer is null)
                throw new NotFoundException();

            if (!_userContextService.User.IsInRole(AppConfiguration.AppRole.Admin.ToString()))
            {
                if (_userContextService.GetUserId != jobOffer.Company.User.Id)
                    throw new ForbiddenException("Brak dostępu");
            }
        }

        private void CheckAccessByJobApplication(int applicationId)
        {
            var jobApplication = _db.JobApplications
                .Include(m => m.JobOffer)
                .ThenInclude(m => m.Company)
                .ThenInclude(m => m.User)
                .FirstOrDefault(m => m.Id == applicationId);

            if (jobApplication is null)
                throw new NotFoundException();

            if (!_userContextService.User.IsInRole(AppConfiguration.AppRole.Admin.ToString()))
            {
                if (_userContextService.GetUserId != jobApplication.JobOffer.Company.User.Id && _userContextService.GetUserId != jobApplication.UserId)
                    throw new ForbiddenException("Brak dostępu");
            }
        }

        public async Task<JobApplicationDto> GetJobApplicationAsync(int id)
        {
            var jobApplication = await _db.JobApplications.Include(m => m.User).FirstOrDefaultAsync(m => m.Id == id);

            if (jobApplication is null)
                throw new NotFoundException();

            CheckAccessByJobApplication(jobApplication.Id);

            return _mapper.Map<JobApplicationDto>(jobApplication);
        }
    }
}
