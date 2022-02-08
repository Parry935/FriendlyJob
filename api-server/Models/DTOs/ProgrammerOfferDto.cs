using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class ProgrammerOfferDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Localization { get; set; }
        public decimal? Experience { get; set; }
        public string Date { get; set; }
        public bool? Remote { get; set; }
        public string Education { get; set; }
        public string Language { get; set; }
        public string Contracts { get; set; }
        public string Time { get; set; }
        public string Description { get; set; }
        public UserDto User { get; set; }
        public List<string> TechnologyMain { get; set; }
        public List<string> TechnologyNiceToHave { get; set; }
    }
}
