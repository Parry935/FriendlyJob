using api_server.Interfaces.Services;
using api_server.Models.DTOs;
using api_server.Models.DTOs.CreateDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace api_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IReportsService _reportService;

        public ReportsController(IReportsService reportService)
        {
            _reportService = reportService;
        }

        [Authorize(Roles = "Admin,Programmer")]
        [HttpPost]
        public async Task<ActionResult> CreateReport([FromBody] CreateReportDto createReportDto)
        {
            await _reportService.CreateReportAsync(createReportDto);

            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReportDto>>> GetReports([FromQuery] int Page)
        {
            var reports = await _reportService.GetReportsAsync(Page);

            return Ok(reports);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ReportDto>> GetReport([FromRoute] int id)
        {
            var report = await _reportService.GetReportAsync(id);

            return Ok(report);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteReport([FromRoute] int id)
        {
            await _reportService.DeleteReportAsync(id);

            return NoContent();
        }
    }
}
