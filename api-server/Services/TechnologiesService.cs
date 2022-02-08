using api_server.Database;
using api_server.Entities;
using api_server.Exceptions;
using api_server.Interfaces.Services;
using api_server.Models.DTOs;
using api_server.Models.Query;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Services
{
    public class TechnologiesService : ITechnologiesService
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public TechnologiesService(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<TechnologyDto> CreateTechnologyAsync(string name)
        {
            var technologyFromDb = await _db.Technologies.FirstOrDefaultAsync(m => m.Name.ToUpper().Equals(name.Trim().ToUpper()));

            if (technologyFromDb is not null)
                throw new BadRequestException("Technologia o podanej nazwie już istnieje");

            var technology = new Technology()
            {
                Name = name.Trim()
            };

            _db.Technologies.Add(technology);
            await _db.SaveChangesAsync();

            return _mapper.Map<TechnologyDto>(technology);
        }

        public async Task DeleteTechnologyAsync(int id)
        {
            var technology = await _db.Technologies.FindAsync(id);

            if (technology is null)
                throw new NotFoundException();

            _db.Technologies.Remove(technology);
            await _db.SaveChangesAsync();
        }

        public async Task EditTechnologyAsync(int id, string name)
        {
            var technology = await _db.Technologies.FindAsync(id);

            if (technology is null)
                throw new NotFoundException();

            if (technology.Name.ToUpper() != name.Trim().ToUpper())
            {
                var technologyFromDb = await _db.Technologies.FirstOrDefaultAsync(m => m.Name.ToUpper().Equals(name.Trim().ToUpper()));

                if (technologyFromDb is not null)
                    throw new BadRequestException("Technologia o podanej nazwie już istnieje");

            }

            technology.Name = name.Trim();
            await _db.SaveChangesAsync();
        }

        public async Task<IEnumerable<TechnologyDto>> GetTechnologiesAsync(TechnologiesQuery technologiesQuery)
        {
            var technologies = await _db.Technologies
               .Include(m => m.JobOfferTechnologies)
               .Include(m => m.ProgrammerOfferTechnologies)
               .Where(m => technologiesQuery.Phrase != null ? m.Name.ToUpper().Contains(technologiesQuery.Phrase.ToUpper()) : true)
               .ToListAsync();

            if (technologiesQuery.MostPopular == true)
            {
                technologies = technologies
                    .OrderByDescending(m => m.ProgrammerOfferTechnologies.Count + m.JobOfferTechnologies.Count)
                    .ToList();
            }
            else
            {
                technologies = technologies
                    .OrderBy(m => m.Name)
                    .ToList();
            }

            if (technologiesQuery.Count > 0)
                technologies = technologies.Take(technologiesQuery.Count).ToList();

            return _mapper.Map<IEnumerable<TechnologyDto>>(technologies);

        }
    }
}
