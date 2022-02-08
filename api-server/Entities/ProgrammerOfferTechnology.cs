using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Entities
{
    public class ProgrammerOfferTechnology
    {
        public int ProgrammerOfferId { get; set; }
        public int TechnologyId { get; set; }
        public bool Main { get; set; }
        public virtual ProgrammerOffer ProgrammerOffer { get; set; }
        public virtual Technology Technology { get; set; }
    }
}
