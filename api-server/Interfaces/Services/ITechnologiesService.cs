using api_server.Models.DTOs;
using api_server.Models.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Interfaces.Services
{
    public interface ITechnologiesService
    {
        Task <IEnumerable<TechnologyDto>> GetTechnologiesAsync(TechnologiesQuery technologiesQuery);
        Task EditTechnologyAsync(int id, string name);
        Task DeleteTechnologyAsync(int id);
        Task<TechnologyDto> CreateTechnologyAsync(string name);
    }
}
