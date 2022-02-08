using api_server.Utility;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Entities
{
    public class JobOffer
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Localization { get; set; }
        public decimal? Salary { get; set; }
        public decimal? Experience { get; set; }
        public DateTime Date { get; set; }
        public bool? Remote { get; set; }
        public OfferEnumerations.LevelType? Level { get; set; }
        public OfferEnumerations.LanguageType? Language { get; set; }
        public OfferEnumerations.ContractsType? Contracts { get; set; }
        public OfferEnumerations.TimeType? Time { get; set; }
        public string Description { get; set; }
        public int CompanyId { get; set; }

        [ForeignKey("CompanyId")]
        public virtual Company Company { get; set; }
        public virtual ICollection<JobOfferTechnology> JobOfferTechnologies { get; set; }
    }
}
