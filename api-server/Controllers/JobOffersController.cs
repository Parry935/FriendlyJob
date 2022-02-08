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
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class JobOffersController : ControllerBase
    {
        private readonly IJobOffersService _jobOffersService;

        public JobOffersController(IJobOffersService jobOffersService)
        {
            _jobOffersService = jobOffersService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobOfferDto>>> GetJobOffers([FromQuery] JobOfferQuery JobOfferQuery, [FromQuery] int Page)
        {
            var jobOffers = await _jobOffersService.GetJobOffersAsync(JobOfferQuery, Page);

            return Ok(jobOffers);
        }

        [HttpGet("user/{id:int}")]
        public async Task<ActionResult<IEnumerable<JobOfferDto>>> GetJobOffersForUser([FromRoute] int id)
        {
            var jobOffers = await _jobOffersService.GetJobOffersForUserAsync(id);

            return Ok(jobOffers);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<JobOfferDto>> GetJobOffer([FromRoute] int id)
        {
            var jobOffer = await _jobOffersService.GetJobOfferAsync(id);

            return Ok(jobOffer);
        }

        [Authorize(Roles = "Company")]
        [HttpPost]
        public async Task<ActionResult<JobOfferDto>> CreateJobOffer([FromBody] CreateJobOfferDto createJobOfferDto)
        {
            var createdJobOffer = await _jobOffersService.CreateJobOfferAsync(createJobOfferDto);

            return Ok(createdJobOffer);
        }

        [Authorize(Roles = "Admin,Company")]
        [HttpPut("{id:int}")]
        public async Task<ActionResult<JobOfferDto>> EditJobOffer([FromRoute] int id, [FromBody] CreateJobOfferDto modifiedJobOfferDto)
        {
            var jobOffer = await _jobOffersService.EditJobOfferAsync(id, modifiedJobOfferDto);

            return Ok(jobOffer);
        }

        [Authorize(Roles = "Admin,Company")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteJobOffer([FromRoute] int id)
        {
            await _jobOffersService.DeleteJobOfferAsync(id);

            return NoContent();
        }
    }
}
