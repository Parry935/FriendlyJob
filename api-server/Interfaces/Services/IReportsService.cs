using api_server.Models.DTOs;
using api_server.Models.DTOs.CreateDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Interfaces.Services
{
    public interface IReportsService
    {
        Task CreateReportAsync(CreateReportDto createReportDto);
        Task<IEnumerable<ReportDto>> GetReportsAsync(int page);
        Task DeleteReportAsync(int id);
        Task<ReportDto> GetReportAsync(int id);
    }
}
