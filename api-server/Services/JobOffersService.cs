using api_server.Controllers;
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
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Services
{
    public class JobOffersService : IJobOffersService
    {
        private readonly AppDbContext _db;
        private readonly IUserContextService _userContextService;
        private readonly IMapper _mapper;

        public JobOffersService(AppDbContext db, IUserContextService userContextService, IMapper mapper)
        {
            _db = db;
            _userContextService = userContextService;
            _mapper = mapper;
        }

        public async Task<IEnumerable<JobOfferDto>> GetJobOffersAsync(JobOfferQuery jobOfferQuery, int page)
        {
            if (page <= 0)
                throw new BadRequestException();

            IQueryable<JobOffer> query = _db.JobOffers;

            AddConditionalsToJobOfferQuery(ref query, jobOfferQuery);

            var jobOffersFromDb = await query
                .Include(m => m.Company)
                .ThenInclude(m => m.User)
                .Include(m => m.JobOfferTechnologies)
                .ThenInclude(m => m.Technology)
                .OrderByDescending(m => m.Date)
                .ToListAsync();

            FilterByLocalization(ref jobOffersFromDb, jobOfferQuery);

            jobOffersFromDb = jobOffersFromDb.Skip(AppConfiguration.pageSize * (page - 1)).Take(AppConfiguration.pageSize).ToList();

            return _mapper.Map<IEnumerable<JobOfferDto>>(jobOffersFromDb);
        }

        private void FilterByLocalization(ref List<JobOffer> jobOffersFromDb, JobOfferQuery jobOfferQuery)
        {
            if (jobOfferQuery.Localization is not null && jobOfferQuery.Localization.Count > 0)
            {
                var localizationUpper = jobOfferQuery.Localization.ConvertAll(m => m.ToUpper().Replace(" ", string.Empty)).ToList();
                jobOffersFromDb = jobOffersFromDb.Where(m => m.Localization.ToUpper().Replace(" ", string.Empty).Split(',', ';').ToList().Intersect(localizationUpper).Any()).ToList();
            }
        }

        private void AddConditionalsToJobOfferQuery(ref IQueryable<JobOffer> query, JobOfferQuery jobOfferQuery)
        {
            if (!jobOfferQuery.LevelJ)
                query = query.Where(m => m.Level != OfferEnumerations.LevelType.Junior);

            if (!jobOfferQuery.LevelM)
                query = query.Where(m => m.Level != OfferEnumerations.LevelType.Mid);

            if (!jobOfferQuery.LevelS)
                query = query.Where(m => m.Level != OfferEnumerations.LevelType.Senior);


            if (!jobOfferQuery.JobTimeFull)
                query = query.Where(m => m.Time != OfferEnumerations.TimeType.FullTime);

            if (!jobOfferQuery.JobTime12)
                query = query.Where(m => m.Time != OfferEnumerations.TimeType.HalfTime);

            if (!jobOfferQuery.JobTime34)
                query = query.Where(m => m.Time != OfferEnumerations.TimeType.ThreeQuarterTime);

            if (!jobOfferQuery.JobTimeNS)
                query = query.Where(m => m.Time != null);


            if (!(jobOfferQuery.ContractP && jobOfferQuery.ContractB && jobOfferQuery.ContractM))
                query = query.Where(m => m.Contracts != null ? OfferEnumerations.ConvertFilterContractsToEnumList
                (jobOfferQuery.ContractP,
                jobOfferQuery.ContractB,
                jobOfferQuery.ContractM)
                .Contains((OfferEnumerations.ContractsType)m.Contracts) : true);

            if (!jobOfferQuery.ContractNS)
                query = query.Where(m => m.Contracts != null);


            if (jobOfferQuery.Salary)
                query = query.Where(m => m.Salary != null);

            if (jobOfferQuery.Remote)
                query = query.Where(m => m.Remote == true);


            if(jobOfferQuery.ExpFrom is not null)
                query = query.Where(m => m.Experience >= jobOfferQuery.ExpFrom);

            if (jobOfferQuery.ExpTo is not null)
                query = query.Where(m => m.Experience <= jobOfferQuery.ExpTo);

            if(jobOfferQuery.Language is not null
                && OfferEnumerations.LanguageDictionary
                .ContainsKey(jobOfferQuery.Language
                .ToUpper()))
                query = query.Where(m => m.Language == null || m.Language <= OfferEnumerations.LanguageDictionary[jobOfferQuery.Language.ToUpper()]);

            if (jobOfferQuery.SalaryFrom is not null)
                query = query.Where(m => m.Salary >= jobOfferQuery.SalaryFrom);

            if (jobOfferQuery.SalaryTo is not null)
                query = query.Where(m => m.Salary <= jobOfferQuery.SalaryTo);

            if (jobOfferQuery.Phrase is not null && jobOfferQuery.Phrase.Count > 0)
            {
                var phraseUpper = jobOfferQuery.Phrase.ConvertAll(m => m.ToUpper()).ToList();

                foreach (var item in phraseUpper)
                    query = query.Where(m => m.Title.ToUpper().Contains(item.Trim()) || m.Description.ToUpper().Contains(item.Trim()));
            }

            if (jobOfferQuery.TechnologyMain is not null && jobOfferQuery.TechnologyMain.Count > 0)
            {
                var technologyMainUpper = jobOfferQuery.TechnologyMain.ConvertAll(m => m.ToUpper()).ToList();

                foreach (var item in technologyMainUpper)
                    query = query.Where(m => m.JobOfferTechnologies.Where(c => c.Main == true).Select(c => c.Technology.Name.ToUpper()).Contains(item.Trim()));
            }

            if (jobOfferQuery.TechnologyNiceToHave is not null && jobOfferQuery.TechnologyNiceToHave.Count > 0)
            {
                var technologyNiceToHaveMainUpper = jobOfferQuery.TechnologyNiceToHave.ConvertAll(m => m.ToUpper()).ToList();

                foreach (var item in technologyNiceToHaveMainUpper)
                    query = query.Where(m => m.JobOfferTechnologies.Where(c => c.Main == false).Select(c => c.Technology.Name.ToUpper()).Contains(item.Trim()));
            }
        }

        public async Task<JobOfferDto> CreateJobOfferAsync(CreateJobOfferDto createJobOfferDto)
        {
            ValidTechnologies(createJobOfferDto);

            var jobOffer = _mapper.Map<JobOffer>(createJobOfferDto);

            FillEnumerationValues(jobOffer, createJobOfferDto);

            var user = await GetCurrentUserWithCompany();

            if (user.Company is null)
                throw new NotFoundException("Nie znaleziono firmy");

            jobOffer.CompanyId = (int)user.CompanyId;
            jobOffer.Company = user.Company;
            jobOffer.Date = DateTime.Now;

            FillTechnologies(jobOffer, createJobOfferDto);

            _db.JobOffers.Add(jobOffer);
            await _db.SaveChangesAsync();

            return _mapper.Map<JobOfferDto>(jobOffer);
        }

        public async Task DeleteJobOfferAsync(int id)
        {
            var jobOffer = await _db.JobOffers.FirstOrDefaultAsync(m => m.Id == id);

            if (jobOffer is null)
                throw new NotFoundException();

            await CheckAccess(jobOffer);

            await DeleteJobApplicationFiles(id);

            _db.JobOffers.Remove(jobOffer);
            await _db.SaveChangesAsync();         
        }

        private async Task DeleteJobApplicationFiles(int id)
        {
            var rootPath = Directory.GetCurrentDirectory();
            var path = $"{rootPath}/Files";

            var jobApplications = await _db.JobApplications.Where(m => m.JobOfferId == id).ToListAsync();

            foreach (var item in jobApplications)
            {
                var files = Directory.GetFiles(path, item.File);

                foreach (var file in files)
                {
                    if (System.IO.File.Exists(file))
                    {
                        System.IO.File.Delete(file);
                    }
                }
            }
        }

        public async Task<JobOfferDto> EditJobOfferAsync(int id, CreateJobOfferDto modifiedJobOfferDto)
        {
            var jobOfferFromDb = await _db.JobOffers
                .Include(m => m.Company)
                .ThenInclude(m => m.User)
                .Include(m => m.JobOfferTechnologies)
                .ThenInclude(m => m.Technology)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (jobOfferFromDb is null)
                throw new NotFoundException();

            await CheckAccess(jobOfferFromDb);

            ValidTechnologies(modifiedJobOfferDto);

            FillBasicValues(jobOfferFromDb, modifiedJobOfferDto);

            FillEnumerationValues(jobOfferFromDb, modifiedJobOfferDto);

            ChcekTechnologiesForJobOffer(jobOfferFromDb, modifiedJobOfferDto);

            await _db.SaveChangesAsync();

            return _mapper.Map<JobOfferDto>(jobOfferFromDb);
        }

        public void ValidTechnologies(CreateJobOfferDto jobOfferDto)
        {
            jobOfferDto.TechnologyMain = jobOfferDto.TechnologyMain.Select(m => m.Trim()).ToList();
            jobOfferDto.TechnologyNiceToHave = jobOfferDto.TechnologyNiceToHave.Select(m => m.Trim()).ToList();

            if (jobOfferDto.TechnologyMain is null || jobOfferDto.TechnologyMain.Count() <= 0)
                throw new BadRequestException("Oferta musi zawierać przynajmniej jedną główną technologię");

            if(jobOfferDto.TechnologyMain.ConvertAll(m => m.ToUpper()).Distinct().Count() != 
                jobOfferDto.TechnologyMain.Count())
                throw new BadRequestException("Technologie głowne nie mogą się powtarzać");

            if (jobOfferDto.TechnologyNiceToHave is not null && jobOfferDto.TechnologyNiceToHave.Count() > 0)
            {
                if (jobOfferDto.TechnologyNiceToHave.ConvertAll(m => m.ToUpper()).Distinct().Count() != 
                    jobOfferDto.TechnologyNiceToHave.Count())
                    throw new BadRequestException("Technologie poboczne nie mogą się powtarzać");

                if(jobOfferDto.TechnologyMain.ConvertAll(m => m.ToUpper()).Intersect(jobOfferDto.TechnologyNiceToHave.ConvertAll(m => m.ToUpper())).Any())
                    throw new BadRequestException("Technologie głowne i poboczne nie mogą być takie same");
            }


            foreach (var item in jobOfferDto.TechnologyMain)
            {
                if (string.IsNullOrEmpty(item) || item.All(char.IsWhiteSpace))
                    throw new BadRequestException("Technologia jest pusta lub zawiera tylko puste znaki");
            }

            foreach (var item in jobOfferDto.TechnologyNiceToHave)
            {
                if (string.IsNullOrEmpty(item) || item.All(char.IsWhiteSpace))
                    throw new BadRequestException("Technologia jest pusta lub zawiera tylko puste znaki");
            }
        }

        public async Task<JobOfferDto> GetJobOfferAsync(int id)
        {
            var jobOffer = await _db.JobOffers
                .Include(m => m.Company)
                .ThenInclude(m => m.User)
                .Include(m => m.JobOfferTechnologies)
                .ThenInclude(m => m.Technology)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (jobOffer is null)
                throw new NotFoundException();

            return _mapper.Map<JobOfferDto>(jobOffer);
        }

        private void FillBasicValues(JobOffer jobOfferFromDb, CreateJobOfferDto modifiedJobOfferDto)
        {
            jobOfferFromDb.Description = modifiedJobOfferDto.Description;
            jobOfferFromDb.Experience = modifiedJobOfferDto.Experience;
            jobOfferFromDb.Localization = modifiedJobOfferDto.Localization;
            jobOfferFromDb.Remote = modifiedJobOfferDto.Remote;
            jobOfferFromDb.Salary = modifiedJobOfferDto.Salary;
            jobOfferFromDb.Title = modifiedJobOfferDto.Title;
        }

        private void FillEnumerationValues(JobOffer jobOffer, CreateJobOfferDto jobOfferDto)
        {
            if (jobOfferDto.Level is not null && OfferEnumerations.LevelDictionary.ContainsKey(jobOfferDto.Level.ToUpper()))
                jobOffer.Level = OfferEnumerations.LevelDictionary[jobOfferDto.Level.ToUpper()];
            else
                jobOffer.Level = null;

            if (jobOfferDto.Language is not null && OfferEnumerations.LanguageDictionary.ContainsKey(jobOfferDto.Language.ToUpper()))
                jobOffer.Language = OfferEnumerations.LanguageDictionary[jobOfferDto.Language.ToUpper()];
            else
                jobOffer.Language = null;

            if (jobOfferDto.Time is not null && OfferEnumerations.TimeDictionary.ContainsKey(jobOfferDto.Time.ToUpper()))
                jobOffer.Time = OfferEnumerations.TimeDictionary[jobOfferDto.Time.ToUpper()];
            else
                jobOffer.Time = null;

            jobOffer.Contracts = OfferEnumerations.ConvertContractsToEnum
                (jobOfferDto.ContractP,
                 jobOfferDto.ContractB,
                 jobOfferDto.ContractM);
        }

        private void FillTechnologies(JobOffer jobOffer, CreateJobOfferDto createJobOfferDto)
        {
            foreach (var item in createJobOfferDto.TechnologyMain)
            {
                JoinTechnology(jobOffer, true, item);
            }

            foreach (var item in createJobOfferDto.TechnologyNiceToHave)
            {
                JoinTechnology(jobOffer, false, item);
            }
        }

        private void JoinTechnology(JobOffer jobOffer, bool IsMain, string technologyName)
        {
            var technology = _db.Technologies.FirstOrDefault(m => m.Name.ToUpper().Equals(technologyName.ToUpper()));

            if (technology is null)
            {
                var newTechnologyToDb = new Technology()
                {
                    Name = technologyName
                };

                var jobTechnologyToDb = new JobOfferTechnology()
                {
                    Technology = newTechnologyToDb,
                    JobOffer = jobOffer,
                    Main = IsMain
                };

                _db.Technologies.Add(newTechnologyToDb);
                _db.JobOfferTechnologies.Add(jobTechnologyToDb);

            }
            else
            {
                var jobTechnologyToDb = new JobOfferTechnology()
                {
                    Technology = technology,
                    JobOffer = jobOffer,
                    Main = IsMain
                };

                _db.JobOfferTechnologies.Add(jobTechnologyToDb);
            }
        }

        private void ChcekTechnologiesForJobOffer(JobOffer jobOffer, CreateJobOfferDto modifiedJobOfferDto)
        {
            var jobTechnologyMainList = jobOffer.JobOfferTechnologies.Where(m => m.Main == true).ToList();
            var jobTechnologyNiceToHaveList = jobOffer.JobOfferTechnologies.Where(m => m.Main == false).ToList();


            foreach (var item in jobTechnologyMainList)
            {
                if (!modifiedJobOfferDto.TechnologyMain.ConvertAll(m => m.ToUpper()).Contains(item.Technology.Name.ToUpper()))
                    _db.JobOfferTechnologies.Remove(item);         
            }

            foreach (var item in modifiedJobOfferDto.TechnologyMain)
            {
                if (!jobTechnologyMainList.Select(m => m.Technology.Name.ToUpper()).Contains(item.ToUpper()))
                    JoinTechnology(jobOffer, true, item);
            }

            foreach (var item in jobTechnologyNiceToHaveList)
            {
                if (!modifiedJobOfferDto.TechnologyNiceToHave.ConvertAll(m => m.ToUpper()).Contains(item.Technology.Name.ToUpper()))
                    _db.JobOfferTechnologies.Remove(item);   
            }

            foreach (var item in modifiedJobOfferDto.TechnologyNiceToHave)
            {
                if (!jobTechnologyNiceToHaveList.Select(m => m.Technology.Name.ToUpper()).Contains(item.ToUpper()))
                    JoinTechnology(jobOffer, false, item);   
            }
        }

        private async Task<User> GetCurrentUserWithCompany()
        {
            var userId = _userContextService.GetUserId;

            if (userId is null)
                throw new NotFoundException("Nie znaleziono użytkownika");

            var user = await _db.Users
                .Include(m => m.Company)
                .FirstOrDefaultAsync(m => m.Id == userId);

            if (user is null)
                throw new NotFoundException("Nie znaleziono użytkownika");

            return user;
        }

        private async Task CheckAccess(JobOffer jobOffer)
        {
            var user = await GetCurrentUserWithCompany();

            if (!_userContextService.User.IsInRole(AppConfiguration.AppRole.Admin.ToString()))
            {
                if (user.CompanyId is null || user.CompanyId != jobOffer.CompanyId)
                    throw new ForbiddenException("Brak dostępu");
            }
        }

        public async Task<IEnumerable<JobOfferDto>> GetJobOffersForUserAsync(int id)
        {
            var user = await _db.Users.FirstOrDefaultAsync(m => m.Id == id);

            if (user is null)
                throw new NotFoundException("Nie znaleziono użytkownika");

            var jobOffersFromDb = await _db.JobOffers
               .Where(m => m.Company.User.Id == id)
               .Include(m => m.Company)
               .ThenInclude(m => m.User)
               .Include(m => m.JobOfferTechnologies)
               .ThenInclude(m => m.Technology)
               .OrderByDescending(m => m.Date)
               .ToListAsync();

            return _mapper.Map<IEnumerable<JobOfferDto>>(jobOffersFromDb);
        }
    }
}
