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
    [Authorize(Roles = "Admin,Programmer")]
    [Route("api/[controller]")]
    [ApiController]
    public class OpinionsController : ControllerBase
    {
        private readonly IOpinionsService _opinionsService;

        public OpinionsController(IOpinionsService opinionsService)
        {
            _opinionsService = opinionsService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OpinionDto>>> GetOpinions([FromQuery] int Company, [FromQuery] string SortBy, [FromQuery] int Page)
        {
            var opinions = await _opinionsService.GetOpinionsAsync(Company, SortBy, Page);

            return Ok(opinions);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<OpinionDto>> GetOpinion([FromRoute] int id)
        {
            var opinion = await _opinionsService.GetOpinionAsync(id);

            return Ok(opinion);
        }

        [HttpPost]
        public async Task<ActionResult<OpinionDto>> CreateOpinion([FromBody] CreateOpinionDto createOpinionDto)
        {
            var createdOpinion = await _opinionsService.CreateOpinionAsync(createOpinionDto);

            return Ok(createdOpinion);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteOpinion([FromRoute] int id)
        {
            await _opinionsService.DeleteOpinionAsync(id);

            return NoContent();
        }

        [HttpPatch("{id:int}")]
        public async Task<ActionResult> UpdateOpinion([FromBody] UpdateOpinionDto updateOpinionDto, [FromRoute] int id)
        {
            await _opinionsService.UpdateOpinionAsync(id, updateOpinionDto.Content);

            return Ok();
        }
    }
}
