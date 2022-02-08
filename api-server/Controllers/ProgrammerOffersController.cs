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
    public class ProgrammerOffersController : ControllerBase
    {
        private readonly IProgrammerOffersService _programmerOffersService;

        public ProgrammerOffersController(IProgrammerOffersService programmerOffersService)
        {
            _programmerOffersService = programmerOffersService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProgrammerOfferDto>>> GetProgrammerOffers([FromQuery] ProgrammerOfferQuery ProgrammerOfferQuery, [FromQuery] int Page)
        {
            var programmersOffers = await _programmerOffersService.GetProgrammerOffersAsync(ProgrammerOfferQuery, Page);

             return Ok(programmersOffers);
        }

        [HttpGet("user/{id:int}")]
        public async Task<ActionResult<IEnumerable<ProgrammerOfferDto>>> GetProgrammerOffersForUser([FromRoute] int id)
        {
            var programmersOffers = await _programmerOffersService.GetProgrammerOffersForUserAsync(id);

            return Ok(programmersOffers);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProgrammerOfferDto>> GetProgrammerOffer([FromRoute] int id)
        {
            var programmerOffer = await _programmerOffersService.GetProgrammerOfferAsync(id);

            return Ok(programmerOffer);
        }

        [Authorize(Roles = "Programmer")]
        [HttpPost]
        public async Task<ActionResult<ProgrammerOfferDto>> CreateProgrammerOffer([FromBody] CreateProgrammerOfferDto createProgrammerOfferDto)
        {
            var createdProgrammerOffer = await _programmerOffersService.CreateProgrammerOfferAsync(createProgrammerOfferDto);

            return Ok(createdProgrammerOffer);
        }

        [Authorize(Roles = "Admin,Programmer")]
        [HttpPut("{id:int}")]
        public async Task<ActionResult<ProgrammerOfferDto>> EditProgrammerOffer([FromRoute] int id, [FromBody] CreateProgrammerOfferDto modifiedProgrammerOfferDto)
        {
            var programmerOffers = await _programmerOffersService.EditProgrammerOfferAsync(id, modifiedProgrammerOfferDto);

            return Ok(programmerOffers);
        }

        [Authorize(Roles = "Admin,Programmer")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteProgrammerOffer([FromRoute] int id)
        {
            await _programmerOffersService.DeleteProgrammerOfferAsync(id);

            return NoContent();
        }
    }
}
