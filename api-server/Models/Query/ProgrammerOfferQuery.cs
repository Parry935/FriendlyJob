using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class ProgrammerOfferQuery
    {
        public bool EducationV { get; set; }
        public bool EducationE { get; set; }
        public bool EducationM { get; set; }
        public bool EducationNS { get; set; }
        public bool JobTimeFull { get; set; }
        public bool JobTime34 { get; set; }
        public bool JobTime12 { get; set; }
        public bool JobTimeNS { get; set; }
        public bool ContractP { get; set; }
        public bool ContractB { get; set; }
        public bool ContractM { get; set; }
        public bool ContractNS { get; set; }
        public bool Remote { get; set; }
        public decimal? ExpFrom { get; set; }
        public decimal? ExpTo { get; set; }
        public string Language { get; set; }
        public List<string> Localization { get; set; }
        public List<string> Phrase { get; set; }
        public List<string> TechnologyMain { get; set; }
        public List<string> TechnologyNiceToHave { get; set; }
    }
}
