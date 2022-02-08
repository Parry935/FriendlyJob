using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Entities
{
    public class Rating
    {
        public int Id { get; set; }
        public bool Positive { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }
        public int OpinionId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [ForeignKey("OpinionId")]
        public virtual Opinion Opinion { get; set; }
    }
}
