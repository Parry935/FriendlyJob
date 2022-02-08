using api_server.Database;
using api_server.Entities;
using api_server.Exceptions;
using api_server.Interfaces.Services;
using api_server.Models.DTOs;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Services
{
    public class RatingsService : IRatingsService
    {
        private readonly AppDbContext _db;
        private readonly IUserContextService _userContextService;
        private readonly IMapper _mapper;

        public RatingsService(AppDbContext db, IUserContextService userContextService, IMapper mapper)
        {
            _db = db;
            _userContextService = userContextService;
            _mapper = mapper;
        }

        private Rating CreateLike(int opinionId)
        {
            var rating = new Rating()
            {
                Date = DateTime.Now,
                Positive = true,
                UserId = (int)_userContextService.GetUserId,
                OpinionId = opinionId
            };

            return rating;
        }

        private Rating CreateDislike(int opinionId)
        {
            var rating = new Rating()
            {
                Date = DateTime.Now,
                Positive = false,
                UserId = (int)_userContextService.GetUserId,
                OpinionId = opinionId
            };

            return rating;
        }

        public async Task<RatingsDto> PostLikeAsync(int id)
        {
            var opinion = await _db.Opinions.Include(m => m.Ratings).FirstOrDefaultAsync(m => m.Id == id);

            if (opinion is null)
                throw new NotFoundException();

            int userId = (int)_userContextService.GetUserId;

            var rating = await _db.Ratings.FirstOrDefaultAsync(m => m.OpinionId == id && m.UserId == userId);

            if (rating is null)
            {
                var likeToDb = CreateLike(id);

                _db.Add(likeToDb);
            }
            else if (rating.Positive == false)
            {
                var likeToDb = CreateLike(id);

                _db.Remove(rating);
                _db.Add(likeToDb);
            }
            else if (rating.Positive == true)
                throw new BadRequestException("Like już istnieje");

            await _db.SaveChangesAsync();

            return _mapper.Map<RatingsDto>(opinion);
        }

        public async Task<RatingsDto> DeleteLikeAsync(int id)
        {
            var opinion = await _db.Opinions.Include(m => m.Ratings).FirstOrDefaultAsync(m => m.Id == id);

            if (opinion is null)
                throw new NotFoundException();

            int userId = (int)_userContextService.GetUserId;

            var rating = await _db.Ratings.FirstOrDefaultAsync(m => m.OpinionId == id && m.UserId == userId);

            if (rating is not null && rating.Positive == true)
                _db.Remove(rating);

            else
                throw new BadRequestException("Nie znaleziono like do usunięcia");

            await _db.SaveChangesAsync();

            return _mapper.Map<RatingsDto>(opinion);
        }

        public async Task<RatingsDto> PostDislikeAsync(int id)
        {
            var opinion = await _db.Opinions.Include(m => m.Ratings).FirstOrDefaultAsync(m => m.Id == id);

            if (opinion is null)
                throw new NotFoundException();

            int userId = (int)_userContextService.GetUserId;

            var rating = await _db.Ratings.FirstOrDefaultAsync(m => m.OpinionId == id && m.UserId == userId);

            if (rating is null)
            {
                var dislikeToDb = CreateDislike(id);

                _db.Add(dislikeToDb);
            }
            else if (rating.Positive == true)
            {
                var dislikeToDb = CreateDislike(id);

                _db.Remove(rating);
                _db.Add(dislikeToDb);
            }
            else if (rating.Positive == false)
                throw new BadRequestException("Dislike już istnieje");

            await _db.SaveChangesAsync();

            return _mapper.Map<RatingsDto>(opinion);
        }

        public async Task<RatingsDto> DeleteDislikeAsync(int id)
        {
            var opinion = await _db.Opinions.Include(m => m.Ratings).FirstOrDefaultAsync(m => m.Id == id);

            if (opinion is null)
                throw new NotFoundException();

            int userId = (int)_userContextService.GetUserId;

            var rating = await _db.Ratings.FirstOrDefaultAsync(m => m.OpinionId == id && m.UserId == userId);

            if (rating is not null && rating.Positive == false)
                _db.Remove(rating);

            else
                throw new BadRequestException("Nie znaleziono dislike do usunięcia");

            await _db.SaveChangesAsync();

            return _mapper.Map<RatingsDto>(opinion);
        }

        public async Task<RatingsDto> GetRatingsForOpinionAsync(int id)
        {
            var opinion = await _db.Opinions.Include(m => m.Ratings).FirstOrDefaultAsync(m => m.Id == id);

            return _mapper.Map<RatingsDto>(opinion);
        }
    }
}
