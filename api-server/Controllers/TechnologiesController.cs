using api_server.Interfaces.Services;
using api_server.Models.DTOs;
using api_server.Models.DTOs.CreateDTOs;
using api_server.Models.Query;
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
    public class TechnologiesController : ControllerBase
    {
        private readonly ITechnologiesService _technologiesService;

        public TechnologiesController(ITechnologiesService technologiesService)
        {
            _technologiesService = technologiesService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TechnologyDto>>> GetTechnologies([FromQuery] TechnologiesQuery technologiesQuery)
        {
            var technologies = await _technologiesService.GetTechnologiesAsync(technologiesQuery);

            return Ok(technologies);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<TechnologyDto>> CreateTechnology([FromBody] CreateTechnologyDto createReportDto)
        {
            var technology = await _technologiesService.CreateTechnologyAsync(createReportDto.Name);

            return Ok(technology);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<ActionResult> EditTechnology([FromRoute] int id, [FromBody] CreateTechnologyDto updateTechnologyDto)
        {
            await _technologiesService.EditTechnologyAsync(id, updateTechnologyDto.Name);

            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteTechnology([FromRoute] int id)
        {
            await _technologiesService.DeleteTechnologyAsync(id);

            return NoContent();
        }
    }
}
