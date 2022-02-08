using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class TechnologyDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int JobOfferCountMain { get; set; }
        public int JobOfferCountNiceToHave { get; set; }
        public int ProgrammerOfferCountMain { get; set; }
        public int ProgrammerOfferCountNiceToHave { get; set; }
    }
}
