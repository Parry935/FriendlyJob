using api_server.Controllers;
using api_server.Models.DTOs;
using api_server.Models.DTOs.CreateDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Interfaces.Services
{
    public interface IJobOffersService
    {
        Task<JobOfferDto> CreateJobOfferAsync(CreateJobOfferDto createJobOfferDto);
        Task DeleteJobOfferAsync(int id);
        Task<JobOfferDto> GetJobOfferAsync(int id);
        Task<JobOfferDto> EditJobOfferAsync(int id, CreateJobOfferDto modifiedJobOfferDto);
        Task <IEnumerable<JobOfferDto>> GetJobOffersAsync(JobOfferQuery jobOfferQuery, int page);
        Task <IEnumerable<JobOfferDto>> GetJobOffersForUserAsync(int id);
    }
}
