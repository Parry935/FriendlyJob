using api_server.Interfaces.Services;
using api_server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    public class RatingsController : ControllerBase
    {
        private readonly IRatingsService _ratingService;

        public RatingsController(IRatingsService ratingService)
        {
            _ratingService = ratingService;
        }

        [HttpGet]
        [Route("opinion/{id:int}")]
        public async Task<ActionResult<RatingsDto>> GetRatingsForOpinion([FromRoute] int id)
        {
            var ratings = await _ratingService.GetRatingsForOpinionAsync(id);

            return Ok(ratings);
        }

        [HttpPost]
        [Route("like/{id:int}")]
        public async Task<ActionResult<RatingsDto>> PostLike([FromRoute] int id)
        {
            var ratings = await _ratingService.PostLikeAsync(id);

            return Ok(ratings);
        }

        [HttpDelete]
        [Route("like/{id:int}")]
        public async Task<ActionResult<RatingsDto>> DeleteLike([FromRoute] int id)
        {
            var ratings = await _ratingService.DeleteLikeAsync(id);

            return Ok(ratings);
        }

        [HttpPost]
        [Route("dislike/{id:int}")]
        public async Task<ActionResult<RatingsDto>> PostDislike([FromRoute] int id)
        {
            var ratings = await _ratingService.PostDislikeAsync(id);

            return Ok(ratings);
        }

        [HttpDelete]
        [Route("dislike/{id:int}")]
        public async Task<ActionResult<RatingsDto>> DeleteDislike([FromRoute] int id)
        {
            var ratings = await _ratingService.DeleteDislikeAsync(id);

            return Ok(ratings);
        }
    }
}
