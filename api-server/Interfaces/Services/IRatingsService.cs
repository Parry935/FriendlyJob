using api_server.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Interfaces.Services
{
    public interface IRatingsService
    {
        Task<RatingsDto> PostLikeAsync(int id);
        Task<RatingsDto> DeleteLikeAsync(int id);
        Task<RatingsDto> PostDislikeAsync(int id);
        Task<RatingsDto> DeleteDislikeAsync(int id);
        Task<RatingsDto> GetRatingsForOpinionAsync(int id);
    }
}
