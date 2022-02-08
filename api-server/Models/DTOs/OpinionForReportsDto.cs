using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class OpinionForReportsDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string Date { get; set; }
        public bool Anonymous { get; set; }
        public UserDto User { get; set; }
        public CompanyDto Company { get; set; }
    }
}
