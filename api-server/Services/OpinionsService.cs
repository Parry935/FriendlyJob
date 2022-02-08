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
    public class OpinionsService : IOpinionsService
    {
        private readonly AppDbContext _db;
        private readonly IUserContextService _userContextService;
        private readonly IMapper _mapper;

        public enum SortType
        {
            DATEASC,
            DATEDESC,
            LIKES,
            DISLIKES
        }

        public OpinionsService(AppDbContext db, IUserContextService userContextService, IMapper mapper)
        {
            _db = db;
            _userContextService = userContextService;
            _mapper = mapper;
        }

        public async Task<IEnumerable<OpinionDto>> GetOpinionsAsync(int companyId, string sortBy, int page)
        {
            if (page <= 0 || companyId <=0)
                throw new BadRequestException();

            var opinions = await _db.Opinions.Where(m => m.CompanyId == companyId).Include(m =>m.User).Include(m =>m.Ratings).ToListAsync();

            var opinionsDto = _mapper.Map<IEnumerable<OpinionDto>>(opinions);

            if(opinionsDto.Count() != 0 && sortBy is not null)
            {
                var sortByUpper = sortBy.ToUpper();

                if (sortByUpper.Equals(nameof(SortType.DATEASC)))
                    opinionsDto = opinionsDto.OrderBy(m => m.Date).ToList();

                else if (sortByUpper.Equals(nameof(SortType.DATEDESC)))
                    opinionsDto = opinionsDto.OrderByDescending(m => m.Date).ToList();

                else if (sortByUpper.Equals(nameof(SortType.LIKES)))
                    opinionsDto = opinionsDto.OrderByDescending(m => m.UsersIdLikes.Count()).ToList();

                else if (sortByUpper.Equals(nameof(SortType.DISLIKES)))
                    opinionsDto = opinionsDto.OrderByDescending(m => m.UsersIdDislikes.Count()).ToList();
            }

            return opinionsDto.Skip(AppConfiguration.pageSizeOpinions * (page -1)).Take(AppConfiguration.pageSizeOpinions).ToList();
        }

        public async Task<OpinionDto> CreateOpinionAsync(CreateOpinionDto createOpinionDto)
        {
            var company = await _db.Companies.FirstOrDefaultAsync(m => m.Id == createOpinionDto.CompanyId);

            if(company is null)
                throw new BadRequestException();

            var opinion = new Opinion()
            {
                Content = createOpinionDto.Content,
                Anonymous = createOpinionDto.Anonymous,
                Date = DateTime.Now,
                UserId = (int)_userContextService.GetUserId,
                CompanyId = company.Id
            };

            _db.Opinions.Add(opinion);
            await _db.SaveChangesAsync();

            opinion.User = await _db.Users.FindAsync(opinion.UserId);

            return _mapper.Map<OpinionDto>(opinion);
        }

        public async Task DeleteOpinionAsync(int id)
        {
            var opinion = await _db.Opinions.FindAsync(id);

            if (opinion is null)
                throw new NotFoundException();

            _userContextService.CheckAccessByUserId(opinion.UserId);

            _db.Opinions.Remove(opinion);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateOpinionAsync(int id, string content)
        {
            var opinion = await _db.Opinions.FindAsync(id);

            if (opinion is null)
                throw new NotFoundException();

            _userContextService.CheckAccessByUserId(opinion.UserId);

            opinion.Content = content;
            await _db.SaveChangesAsync();
        }

        public async Task<OpinionDto> GetOpinionAsync(int id)
        {
            var opinion = await _db.Opinions.Include(m => m.User).Include(m => m.Ratings).FirstOrDefaultAsync(m => m.Id == id);

            if (opinion is null)
                throw new NotFoundException();

            return _mapper.Map<OpinionDto>(opinion);
        }
    }
}
