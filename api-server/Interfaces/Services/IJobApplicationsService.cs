using api_server.Models.DTOs;
using api_server.Models.DTOs.CreateDTOs;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Interfaces.Services
{
    public interface IJobApplicationsService
    {
        Task<int> CreateJobApplcationAsync(CreateJobApplicationDto createJobApplication);
        Task AddFileToJobApplicationAsync(int id, IFormFile file);
        byte[] GetFile(string fileName, out string contentType);
        Task<IEnumerable<JobApplicationDto>> GetJobApplicationsAsync(int jobOfferId, int userId, int page);
        Task DeleteJobApplcationAsync(int id);
        Task<JobApplicationDto> GetJobApplicationAsync(int id);
    }
}
