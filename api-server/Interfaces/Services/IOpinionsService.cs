using api_server.Models.DTOs;
using api_server.Models.DTOs.CreateDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Interfaces.Services
{
    public interface IOpinionsService
    {
        Task<IEnumerable<OpinionDto>> GetOpinionsAsync(int companyId, string sortBy, int page);
        Task<OpinionDto> CreateOpinionAsync(CreateOpinionDto createOpinionDto);
        Task DeleteOpinionAsync(int id);
        Task UpdateOpinionAsync(int id, string content);
        Task<OpinionDto> GetOpinionAsync(int id);
    }
}
