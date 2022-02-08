using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Entities
{
    public class JobApplication
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string File { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }
        public int JobOfferId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [ForeignKey("JobOfferId")]
        public virtual JobOffer JobOffer { get; set; }

    }
}
