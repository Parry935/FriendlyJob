using api_server.Models.DTOs;
using api_server.Models.DTOs.CreateDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Interfaces.Services
{
    public interface IProgrammerOffersService
    {
        Task<IEnumerable<ProgrammerOfferDto>> GetProgrammerOffersAsync(ProgrammerOfferQuery programmerOfferQuery, int page);
        Task<ProgrammerOfferDto> GetProgrammerOfferAsync(int id);
        Task<ProgrammerOfferDto> CreateProgrammerOfferAsync(CreateProgrammerOfferDto createProgrammerOfferDto);
        Task<ProgrammerOfferDto> EditProgrammerOfferAsync(int id, CreateProgrammerOfferDto modifiedProgrammerOfferDto);
        Task DeleteProgrammerOfferAsync(int id);
        Task<IEnumerable<ProgrammerOfferDto>> GetProgrammerOffersForUserAsync(int id);
    }
}
