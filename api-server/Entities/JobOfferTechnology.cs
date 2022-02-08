using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Entities
{
    public class JobOfferTechnology
    {
        public int JobOfferId { get; set; }
        public int TechnologyId { get; set; }
        public bool Main { get; set; }
        public virtual JobOffer JobOffer { get; set; }
        public virtual Technology Technology { get; set; }
    }
}
