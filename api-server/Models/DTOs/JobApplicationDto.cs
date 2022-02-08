using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class JobApplicationDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string File { get; set; }
        public string Date { get; set; }
        public int JobOfferId { get; set; }
        public UserDto User { get; set; }
    }
}
