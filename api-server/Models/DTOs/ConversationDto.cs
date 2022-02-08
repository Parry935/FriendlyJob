using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class ConversationDto
    {
        public string Date { get; set; }
        public string LastContent { get; set; }
        public int RecipientId { get; set; }
        public bool Readed { get; set; }
        public UserWithCompanyDto User { get; set; }
    }
}
