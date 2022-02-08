using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class UserWithCompanyDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Imię jest wymagane")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Nazwisko jest wymagane")]
        public string LastName { get; set; }
        public string ImageSrc { get; set; }
        public string Description { get; set; }
        public bool Lock { get; set; }
        public string Role { get; set; }
        public CompanyDto Company { get; set; }
    }
}
