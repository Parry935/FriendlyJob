using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class CompanyDto
    {
        public int Id { get; set; }
        public string NIP { get; set; }
        public string Name { get; set; }
    }
}
