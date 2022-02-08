using api_server.Interfaces.Services;
using api_server.Models.DTOs;
using api_server.Models.DTOs.CreateDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class JobApplicationsController : ControllerBase
    {
        private readonly IJobApplicationsService _jobApplicationsService;

        public JobApplicationsController(IJobApplicationsService jobApplicationsService)
        {
            _jobApplicationsService = jobApplicationsService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobApplicationDto>>> GetJobApplications([FromQuery] int JobOfferId, [FromQuery] int UserId, [FromQuery] int Page)
        {
            var applicaions = await _jobApplicationsService.GetJobApplicationsAsync(JobOfferId, UserId, Page);

            return Ok(applicaions);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<JobApplicationDto>> GetJobApplication([FromRoute] int id)
        {
            var applicaion = await _jobApplicationsService.GetJobApplicationAsync(id);

            return Ok(applicaion);
        }

        [HttpGet("file")]
        public ActionResult GetFile([FromQuery] string fileName)
        {
            var file = _jobApplicationsService.GetFile(fileName, out string contentType);

            return File(file, contentType, fileName);
        }

        [Authorize(Roles = "Programmer")]
        [HttpPost]
        public async Task<ActionResult<int>> CreateJobApplcation([FromBody] CreateJobApplicationDto createJobApplication)
        {
            var jobApplicationId = await _jobApplicationsService.CreateJobApplcationAsync(createJobApplication);

            return Ok(jobApplicationId);
        }

        [Authorize(Roles = "Programmer")]
        [HttpPost("file/{id:int}")]
        public async Task<ActionResult> PostFile([FromRoute] int id, [FromForm] IFormFile file)
        {
            await _jobApplicationsService.AddFileToJobApplicationAsync(id, file);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteJobApplcation([FromRoute] int id)
        {
            await _jobApplicationsService.DeleteJobApplcationAsync(id);

            return NoContent();
        }
    }
}
