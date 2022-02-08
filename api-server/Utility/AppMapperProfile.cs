using api_server.Entities;
using api_server.Models.DTOs;
using api_server.Models.DTOs.CreateDTOs;
using AutoMapper;
using EnumsNET;
using System;
using System.Collections.Generic;
using System.Linq;

namespace api_server.Utility
{
    public class AppMapperProfile : Profile
    {
        public AppMapperProfile()
        {
            CreateMap<JobApplication, JobApplicationDto>()
                .ForMember(m => m.Date, r => r.MapFrom(c => c.Date.ToString()));

            CreateMap<Message, MessageDto>()
                .ForMember(m => m.Date, r => r.MapFrom(c => c.Date.ToString()));

            CreateMap<Report, ReportDto>()
                .ForMember(m => m.Date, r => r.MapFrom(c => c.Date.ToString()));

            CreateMap<User, UserDto>();
            CreateMap<User, UserWithCompanyDto>()
                .ForMember(m => m.Role, r => r.MapFrom(c => c.Role.Name));

            CreateMap<User, UserWithCompanyAndEmailDto>()
                .ForMember(m => m.Role, r => r.MapFrom(c => c.Role.Name));

            CreateMap<Company, CompanyDto>();
            CreateMap<Company, CompanyWithUserDto>();

            CreateMap<CreateJobOfferDto, JobOffer>()
                .ForMember(m => m.Level, r => r.Ignore())
                .ForMember(m => m.Language, r => r.Ignore())
                .ForMember(m => m.Time, r => r.Ignore());

            CreateMap<CreateProgrammerOfferDto, ProgrammerOffer>()
                .ForMember(m => m.Education, r => r.Ignore())
                .ForMember(m => m.Language, r => r.Ignore())
                .ForMember(m => m.Time, r => r.Ignore());

            CreateMap<Opinion, OpinionDto>()
                .ForMember(m => m.UsersIdLikes, r => r.MapFrom(c => c.Ratings.Where(s => s.Positive == true).Select(m => m.UserId).ToList()))
                .ForMember(m => m.UsersIdDislikes, r => r.MapFrom(c => c.Ratings.Where(s => s.Positive == false).Select(m => m.UserId).ToList()))
                .ForMember(m => m.Date, r => r.MapFrom(c => c.Date.ToString()))
                .ForMember(m => m.User, r => r.MapFrom(c => c.Anonymous ? null : new UserDto()
                { 
                    Id = c.User.Id,
                    FirstName = c.User.FirstName,
                    LastName = c.User.LastName,
                    ImageSrc = c.User.ImageSrc
                }));

            CreateMap<Opinion, OpinionForReportsDto>()
                .ForMember(m => m.Date, r => r.MapFrom(c => c.Date.ToString()))
                .ForMember(m => m.User, r => r.MapFrom(c => new UserDto()
                {
                    Id = c.User.Id,
                    FirstName = c.User.FirstName,
                    LastName = c.User.LastName,
                    ImageSrc = c.User.ImageSrc
                }));

            CreateMap<JobOffer, JobOfferDto>()
                .ForMember(m => m.Level, r => r.MapFrom(c => c.Level != null ? ((OfferEnumerations.LevelType)c.Level).AsString(EnumFormat.Description) : ""))
                .ForMember(m => m.Language, r => r.MapFrom(c => c.Language != null ? ((OfferEnumerations.LanguageType)c.Language).AsString(EnumFormat.Description) : ""))
                .ForMember(m => m.Contracts, r => r.MapFrom(c => c.Contracts != null ? ((OfferEnumerations.ContractsType)c.Contracts).AsString(EnumFormat.Description) : ""))
                .ForMember(m => m.Time, r => r.MapFrom(c => c.Time != null ? ((OfferEnumerations.TimeType)c.Time).AsString(EnumFormat.Description) : ""))
                .ForMember(m => m.TechnologyMain, r => r.MapFrom(c => c.JobOfferTechnologies.Where(s => s.Main == true).Select(s => s.Technology.Name).ToList()))
                .ForMember(m => m.TechnologyNiceToHave, r => r.MapFrom(c => c.JobOfferTechnologies.Where(s => s.Main == false).Select(s => s.Technology.Name).ToList()))
                .ForMember(m => m.Date, r => r.MapFrom(c => c.Date.ToString()));

            CreateMap<ProgrammerOffer, ProgrammerOfferDto>()
                .ForMember(m => m.Education, r => r.MapFrom(c => c.Education != null ? ((OfferEnumerations.EducationType)c.Education).AsString(EnumFormat.Description) : ""))
                .ForMember(m => m.Language, r => r.MapFrom(c => c.Language != null ? ((OfferEnumerations.LanguageType)c.Language).AsString(EnumFormat.Description) : ""))
                .ForMember(m => m.Contracts, r => r.MapFrom(c => c.Contracts != null ? ((OfferEnumerations.ContractsType)c.Contracts).AsString(EnumFormat.Description) : ""))
                .ForMember(m => m.Time, r => r.MapFrom(c => c.Time != null ? ((OfferEnumerations.TimeType)c.Time).AsString(EnumFormat.Description) : ""))
                .ForMember(m => m.TechnologyMain, r => r.MapFrom(c => c.ProgrammerOfferTechnologies.Where(s => s.Main == true).Select(s => s.Technology.Name).ToList()))
                .ForMember(m => m.TechnologyNiceToHave, r => r.MapFrom(c => c.ProgrammerOfferTechnologies.Where(s => s.Main == false).Select(s => s.Technology.Name).ToList()))
                .ForMember(m => m.Date, r => r.MapFrom(c => c.Date.ToString()));

            CreateMap<Technology, TechnologyDto>()
                .ForMember(m => m.JobOfferCountMain, r => r.MapFrom(c => c.JobOfferTechnologies.Where(s => s.Main == true).Count()))
                .ForMember(m => m.JobOfferCountNiceToHave, r => r.MapFrom(c => c.JobOfferTechnologies.Where(s => s.Main == false).Count()))
                .ForMember(m => m.ProgrammerOfferCountMain, r => r.MapFrom(c => c.ProgrammerOfferTechnologies.Where(s => s.Main == true).Count()))
                .ForMember(m => m.ProgrammerOfferCountNiceToHave, r => r.MapFrom(c => c.ProgrammerOfferTechnologies.Where(s => s.Main == false).Count()));

            CreateMap<Opinion, RatingsDto>()
                .ForMember(m => m.UsersIdLikes, r => r.MapFrom(c => c.Ratings.Where(s => s.Positive == true).Select(m => m.UserId).ToList()))
                .ForMember(m => m.UsersIdDislikes, r => r.MapFrom(c => c.Ratings.Where(s => s.Positive == false).Select(m => m.UserId).ToList()));
        }
    }
}
