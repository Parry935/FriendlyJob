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
    public class ReportsService : IReportsService
    {
        private readonly AppDbContext _db;
        private readonly IUserContextService _userContextService;
        private readonly IMapper _mapper;

        public ReportsService(AppDbContext db, IUserContextService userContextService, IMapper mapper)
        {
            _db = db;
            _userContextService = userContextService;
            _mapper = mapper;
        }

        public async Task CreateReportAsync(CreateReportDto createReportDto)
        {
            var opinion = await _db.Opinions.FindAsync(createReportDto.OpinionId);

            if (opinion is null)
                throw new NotFoundException();

            var reportFromDb = await _db.Reports.FirstOrDefaultAsync(m => m.OpinionId == createReportDto.OpinionId && m.UserId == (int)_userContextService.GetUserId);

            if (reportFromDb is not null)
                throw new BadRequestException("Złosiłeś już tę opinie");


            var report = new Report()
            {
                Reason = createReportDto.Reason,
                Date = DateTime.Now,
                UserId = (int)_userContextService.GetUserId,
                OpinionId = createReportDto.OpinionId
            };

            _db.Reports.Add(report);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteReportAsync(int id)
        {
            var report = await _db.Reports.FindAsync(id);

            if (report is null)
                throw new NotFoundException();

            _db.Reports.Remove(report);
            await _db.SaveChangesAsync();
        }

        public async Task<ReportDto> GetReportAsync(int id)
        {
            var report = await _db.Reports
               .Include(m => m.User)
               .ThenInclude(m => m.Company)
               .Include(m => m.User)
               .ThenInclude(m => m.Role)
               .Include(m => m.Opinion)
               .ThenInclude(m => m.Company)
               .FirstOrDefaultAsync(m => m.Id == id);

            if (report is null)
                throw new NotFoundException();

            return _mapper.Map<ReportDto>(report);
        }

        public async Task<IEnumerable<ReportDto>> GetReportsAsync(int page)
        {
            if (page <= 0)
                throw new BadRequestException();

            var reports = await _db.Reports
                .Include(m => m.User)
                .ThenInclude(m =>m.Company)
                .Include(m => m.User)
                .ThenInclude(m => m.Role)
                .Include(m => m.Opinion)
                .ThenInclude(m => m.Company)
                .Include(m => m.Opinion)
                .ThenInclude(m => m.User)
                .OrderByDescending(m => m.Date)
                .ToListAsync();

            reports = reports.Skip(AppConfiguration.pageSize * (page - 1)).Take(AppConfiguration.pageSize).ToList();

            return _mapper.Map<IEnumerable<ReportDto>>(reports);
        }
    }
}
