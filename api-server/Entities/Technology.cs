using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Entities
{
    public class Technology
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<ProgrammerOfferTechnology> ProgrammerOfferTechnologies { get; set; }
        public virtual ICollection<JobOfferTechnology> JobOfferTechnologies { get; set; }
    }
}
