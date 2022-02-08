using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string Date { get; set; }
        public bool Readed { get; set; }
        public int? RecipientId { get; set; }
        public int? SenderId { get; set; }

    }
}
