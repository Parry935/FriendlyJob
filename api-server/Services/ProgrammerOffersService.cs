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
    public class ProgrammerOffersService : IProgrammerOffersService
    {
        private readonly AppDbContext _db;
        private readonly IUserContextService _userContextService;
        private readonly IMapper _mapper;

        public ProgrammerOffersService(AppDbContext db, IUserContextService userContextService, IMapper mapper)
        {
            _db = db;
            _userContextService = userContextService;
            _mapper = mapper;
        }

        public async Task<ProgrammerOfferDto> CreateProgrammerOfferAsync(CreateProgrammerOfferDto createProgrammerOfferDto)
        {
            ValidTechnologies(createProgrammerOfferDto);

            var programmerOffer = _mapper.Map<ProgrammerOffer>(createProgrammerOfferDto);

            FillEnumerationValues(programmerOffer, createProgrammerOfferDto);

            var user = await GetCurrentUser();

            programmerOffer.UserId = user.Id;
            programmerOffer.User = user;
            programmerOffer.Date = DateTime.Now;

            FillTechnologies(programmerOffer, createProgrammerOfferDto);

            _db.ProgrammerOffers.Add(programmerOffer);
            await _db.SaveChangesAsync();

            return _mapper.Map<ProgrammerOfferDto>(programmerOffer);
        }

        private void FillTechnologies(ProgrammerOffer programmerOffer, CreateProgrammerOfferDto createProgrammerOfferDto)
        {
            foreach (var item in createProgrammerOfferDto.TechnologyMain)
            {
                JoinTechnology(programmerOffer, true, item);
            }

            foreach (var item in createProgrammerOfferDto.TechnologyNiceToHave)
            {
                JoinTechnology(programmerOffer, false, item);
            }
        }

        private void JoinTechnology(ProgrammerOffer programmerOffer, bool IsMain, string technologyName)
        {
            var technology = _db.Technologies.FirstOrDefault(m => m.Name.ToUpper().Equals(technologyName.ToUpper()));

            if (technology is null)
            {
                var newTechnologyToDb = new Technology()
                {
                    Name = technologyName
                };

                var programmerTechnologyToDb = new ProgrammerOfferTechnology()
                {
                    Technology = newTechnologyToDb,
                    ProgrammerOffer = programmerOffer,
                    Main = IsMain
                };

                _db.Technologies.Add(newTechnologyToDb);
                _db.ProgrammerOfferTechnologies.Add(programmerTechnologyToDb);

            }
            else
            {
                var programmerTechnologyToDb = new ProgrammerOfferTechnology()
                {
                    Technology = technology,
                    ProgrammerOffer = programmerOffer,
                    Main = IsMain
                };

                _db.ProgrammerOfferTechnologies.Add(programmerTechnologyToDb);
            }
        }

        private async Task<User> GetCurrentUser()
        {
            var userId = _userContextService.GetUserId;

            if (userId is null)
                throw new NotFoundException("Nie znaleziono użytkownika");

            var user = await _db.Users
                .FirstOrDefaultAsync(m => m.Id == userId);

            if (user is null)
                throw new NotFoundException("Nie znaleziono użytkownika");

            return user;
        }

        private void FillEnumerationValues(ProgrammerOffer programmerOffer, CreateProgrammerOfferDto programmerOfferDto)
        {
            if (programmerOfferDto.Education is not null && OfferEnumerations.EducationDictionary.ContainsKey(programmerOfferDto.Education.ToUpper()))
                programmerOffer.Education = OfferEnumerations.EducationDictionary[programmerOfferDto.Education.ToUpper()];
            else
                programmerOffer.Education = null;

            if (programmerOfferDto.Language is not null && OfferEnumerations.LanguageDictionary.ContainsKey(programmerOfferDto.Language.ToUpper()))
                programmerOffer.Language = OfferEnumerations.LanguageDictionary[programmerOfferDto.Language.ToUpper()];
            else
                programmerOffer.Language = null;

            if (programmerOfferDto.Time is not null && OfferEnumerations.TimeDictionary.ContainsKey(programmerOfferDto.Time.ToUpper()))
                programmerOffer.Time = OfferEnumerations.TimeDictionary[programmerOfferDto.Time.ToUpper()];
            else
                programmerOffer.Time = null;

            programmerOffer.Contracts = OfferEnumerations.ConvertContractsToEnum
                (programmerOfferDto.ContractP,
                 programmerOfferDto.ContractB,
                 programmerOfferDto.ContractM);
        }

        public async Task DeleteProgrammerOfferAsync(int id)
        {
            var programmerOffer = await _db.ProgrammerOffers.FirstOrDefaultAsync(m => m.Id == id);

            if (programmerOffer is null)
                throw new NotFoundException();

            _userContextService.CheckAccessByUserId(programmerOffer.UserId);

            _db.ProgrammerOffers.Remove(programmerOffer);
            await _db.SaveChangesAsync();
        }

        public async Task<ProgrammerOfferDto> EditProgrammerOfferAsync(int id, CreateProgrammerOfferDto modifiedProgrammerOfferDto)
        {
            var programmerOfferFromDb = await _db.ProgrammerOffers
                .Include(m => m.User)
                .Include(m => m.ProgrammerOfferTechnologies)
                .ThenInclude(m => m.Technology)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (programmerOfferFromDb is null)
                throw new NotFoundException();

            _userContextService.CheckAccessByUserId(programmerOfferFromDb.UserId);

            ValidTechnologies(modifiedProgrammerOfferDto);

            FillBasicValues(programmerOfferFromDb, modifiedProgrammerOfferDto);

            FillEnumerationValues(programmerOfferFromDb, modifiedProgrammerOfferDto);

            ChcekTechnologiesForProgrammerOffer(programmerOfferFromDb, modifiedProgrammerOfferDto);

            await _db.SaveChangesAsync();

            return _mapper.Map<ProgrammerOfferDto>(programmerOfferFromDb);
        }

        private void ChcekTechnologiesForProgrammerOffer(ProgrammerOffer programmerOfferFromDb, CreateProgrammerOfferDto modifiedProgrammerOfferDto)
        {
            var programmerTechnologyMainList = programmerOfferFromDb.ProgrammerOfferTechnologies.Where(m => m.Main == true).ToList();
            var programmerTechnologyNiceToHaveList = programmerOfferFromDb.ProgrammerOfferTechnologies.Where(m => m.Main == false).ToList();


            foreach (var item in programmerTechnologyMainList)
            {
                if (!modifiedProgrammerOfferDto.TechnologyMain.ConvertAll(m => m.ToUpper()).Contains(item.Technology.Name.ToUpper()))
                    _db.ProgrammerOfferTechnologies.Remove(item);
            }

            foreach (var item in modifiedProgrammerOfferDto.TechnologyMain)
            {
                if (!programmerTechnologyMainList.Select(m => m.Technology.Name.ToUpper()).Contains(item.ToUpper()))
                    JoinTechnology(programmerOfferFromDb, true, item);
            }

            foreach (var item in programmerTechnologyNiceToHaveList)
            {
                if (!modifiedProgrammerOfferDto.TechnologyNiceToHave.ConvertAll(m => m.ToUpper()).Contains(item.Technology.Name.ToUpper()))
                    _db.ProgrammerOfferTechnologies.Remove(item);
            }

            foreach (var item in modifiedProgrammerOfferDto.TechnologyNiceToHave)
            {
                if (!programmerTechnologyNiceToHaveList.Select(m => m.Technology.Name.ToUpper()).Contains(item.ToUpper()))
                    JoinTechnology(programmerOfferFromDb, false, item);
            }
        }

        private void FillBasicValues(ProgrammerOffer programmerOfferFromDb, CreateProgrammerOfferDto modifiedProgrammerOfferDto)
        {
            programmerOfferFromDb.Description = modifiedProgrammerOfferDto.Description;
            programmerOfferFromDb.Experience = modifiedProgrammerOfferDto.Experience;
            programmerOfferFromDb.Localization = modifiedProgrammerOfferDto.Localization;
            programmerOfferFromDb.Remote = modifiedProgrammerOfferDto.Remote;
            programmerOfferFromDb.Title = modifiedProgrammerOfferDto.Title;
        }

        public async Task<ProgrammerOfferDto> GetProgrammerOfferAsync(int id)
        {
            var programmerOffer = await _db.ProgrammerOffers
                .Include(m => m.User)
                .Include(m => m.ProgrammerOfferTechnologies)
                .ThenInclude(m => m.Technology)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (programmerOffer is null)
                throw new NotFoundException();

            return _mapper.Map<ProgrammerOfferDto>(programmerOffer);
        }

        public async Task<IEnumerable<ProgrammerOfferDto>> GetProgrammerOffersAsync(ProgrammerOfferQuery programmerOfferQuery, int page)
        {
            if (page <= 0)
                throw new BadRequestException();

            IQueryable<ProgrammerOffer> query = _db.ProgrammerOffers;

            AddConditionalsToProgrammerOfferQuery(ref query, programmerOfferQuery);

            var programmerOffersFromDb = await query
                .Include(m => m.User)
                .Include(m => m.ProgrammerOfferTechnologies)
                .ThenInclude(m => m.Technology)
                .OrderByDescending(m => m.Date)
                .ToListAsync();

            FilterByLocalization(ref programmerOffersFromDb, programmerOfferQuery);

            programmerOffersFromDb = programmerOffersFromDb.Skip(AppConfiguration.pageSize * (page - 1)).Take(AppConfiguration.pageSize).ToList();

            return _mapper.Map<IEnumerable<ProgrammerOfferDto>>(programmerOffersFromDb);
        }

        private void FilterByLocalization(ref List<ProgrammerOffer> programmerOffersFromDb, ProgrammerOfferQuery programmerOfferQuery)
        {
            if (programmerOfferQuery.Localization is not null && programmerOfferQuery.Localization.Count > 0)
            {
                var localizationUpper = programmerOfferQuery.Localization.ConvertAll(m => m.ToUpper().Replace(" ", string.Empty)).ToList();
                programmerOffersFromDb = programmerOffersFromDb.Where(m => m.Localization.ToUpper().Replace(" ", string.Empty).Split(',', ';').ToList().Intersect(localizationUpper).Any()).ToList();
            }
        }

        private void AddConditionalsToProgrammerOfferQuery(ref IQueryable<ProgrammerOffer> query, ProgrammerOfferQuery programmerOfferQuery)
        {
            if (!programmerOfferQuery.EducationV)
                query = query.Where(m => m.Education != OfferEnumerations.EducationType.Vocational);

            if (!programmerOfferQuery.EducationE)
                query = query.Where(m => m.Education != OfferEnumerations.EducationType.EngineerOrBachelor);

            if (!programmerOfferQuery.EducationM)
                query = query.Where(m => m.Education != OfferEnumerations.EducationType.Master);

            if (!programmerOfferQuery.EducationNS)
                query = query.Where(m => m.Education != null);


            if (!programmerOfferQuery.JobTimeFull)
                query = query.Where(m => m.Time != OfferEnumerations.TimeType.FullTime);

            if (!programmerOfferQuery.JobTime12)
                query = query.Where(m => m.Time != OfferEnumerations.TimeType.HalfTime);

            if (!programmerOfferQuery.JobTime34)
                query = query.Where(m => m.Time != OfferEnumerations.TimeType.ThreeQuarterTime);

            if (!programmerOfferQuery.JobTimeNS)
                query = query.Where(m => m.Time != null);


            if (!(programmerOfferQuery.ContractP && programmerOfferQuery.ContractB && programmerOfferQuery.ContractM))
                query = query.Where(m => m.Contracts != null ? OfferEnumerations.ConvertFilterContractsToEnumList
                (programmerOfferQuery.ContractP,
                programmerOfferQuery.ContractB,
                programmerOfferQuery.ContractM)
                .Contains((OfferEnumerations.ContractsType)m.Contracts) : true);

            if (!programmerOfferQuery.ContractNS)
                query = query.Where(m => m.Contracts != null);


            if (programmerOfferQuery.Remote)
                query = query.Where(m => m.Remote == true);


            if (programmerOfferQuery.ExpFrom is not null)
                query = query.Where(m => m.Experience >= programmerOfferQuery.ExpFrom);

            if (programmerOfferQuery.ExpTo is not null)
                query = query.Where(m => m.Experience <= programmerOfferQuery.ExpTo);


            if (programmerOfferQuery.Language is not null
                && OfferEnumerations.LanguageDictionary
                .ContainsKey(programmerOfferQuery.Language
                .ToUpper()))
                query = query.Where(m => m.Language != null && m.Language >= OfferEnumerations.LanguageDictionary[programmerOfferQuery.Language.ToUpper()]);

            if (programmerOfferQuery.Phrase is not null && programmerOfferQuery.Phrase.Count > 0)
            {
                var phraseUpper = programmerOfferQuery.Phrase.ConvertAll(m => m.ToUpper()).ToList();

                foreach (var item in phraseUpper)
                    query = query.Where(m => m.Title.ToUpper().Contains(item.Trim()) || m.Description.ToUpper().Contains(item.Trim()));
            }

            if (programmerOfferQuery.TechnologyMain is not null && programmerOfferQuery.TechnologyMain.Count > 0)
            {
                var technologyMainUpper = programmerOfferQuery.TechnologyMain.ConvertAll(m => m.ToUpper()).ToList();

                foreach (var item in technologyMainUpper)
                    query = query.Where(m => m.ProgrammerOfferTechnologies.Where(c => c.Main == true).Select(c => c.Technology.Name.ToUpper()).Contains(item.Trim()));
            }

            if (programmerOfferQuery.TechnologyNiceToHave is not null && programmerOfferQuery.TechnologyNiceToHave.Count > 0)
            {
                var technologyNiceToHaveMainUpper = programmerOfferQuery.TechnologyNiceToHave.ConvertAll(m => m.ToUpper()).ToList();

                foreach (var item in technologyNiceToHaveMainUpper)
                    query = query.Where(m => m.ProgrammerOfferTechnologies.Where(c => c.Main == false).Select(c => c.Technology.Name.ToUpper()).Contains(item.Trim()));
            }
        }

        public void ValidTechnologies(CreateProgrammerOfferDto programmerOfferDto)
        {
            programmerOfferDto.TechnologyMain = programmerOfferDto.TechnologyMain.Select(m => m.Trim()).ToList();
            programmerOfferDto.TechnologyNiceToHave = programmerOfferDto.TechnologyNiceToHave.Select(m => m.Trim()).ToList();

            if (programmerOfferDto.TechnologyMain is null || programmerOfferDto.TechnologyMain.Count() <= 0)
                throw new BadRequestException("Oferta musi zawierać przynajmniej jedną główną technologię");

            if (programmerOfferDto.TechnologyMain.ConvertAll(m => m.ToUpper()).Distinct().Count() !=
                programmerOfferDto.TechnologyMain.Count())
                throw new BadRequestException("Technologie głowne nie mogą się powtarzać");

            if (programmerOfferDto.TechnologyNiceToHave is not null && programmerOfferDto.TechnologyNiceToHave.Count() > 0)
            {
                if (programmerOfferDto.TechnologyNiceToHave.ConvertAll(m => m.ToUpper()).Distinct().Count() !=
                    programmerOfferDto.TechnologyNiceToHave.Count())
                    throw new BadRequestException("Technologie poboczne nie mogą się powtarzać");

                if (programmerOfferDto.TechnologyMain.ConvertAll(m => m.ToUpper()).Intersect(programmerOfferDto.TechnologyNiceToHave.ConvertAll(m => m.ToUpper())).Any())
                    throw new BadRequestException("Technologie głowne i poboczne nie mogą być takie same");
            }

            foreach (var item in programmerOfferDto.TechnologyMain)
            {
                if (string.IsNullOrEmpty(item) || item.All(char.IsWhiteSpace))
                    throw new BadRequestException("Technologia jest pusta lub zawiera tylko puste znaki");
            }

            foreach (var item in programmerOfferDto.TechnologyNiceToHave)
            {
                if (string.IsNullOrEmpty(item) || item.All(char.IsWhiteSpace))
                    throw new BadRequestException("Technologia jest pusta lub zawiera tylko puste znaki");
            }
        }

        public async Task<IEnumerable<ProgrammerOfferDto>> GetProgrammerOffersForUserAsync(int id)
        {
            var user = await _db.Users.FirstOrDefaultAsync(m => m.Id == id);

            if (user is null)
                throw new NotFoundException("Nie znaleziono użytkownika");

            var programmerOffersFromDb = await _db.ProgrammerOffers
               .Where(m => m.UserId == id)
               .Include(m => m.User)
               .Include(m => m.ProgrammerOfferTechnologies)
               .ThenInclude(m => m.Technology)
               .OrderByDescending(m => m.Date)
               .ToListAsync();

            return _mapper.Map<IEnumerable<ProgrammerOfferDto>>(programmerOffersFromDb);
        }
    }
}
