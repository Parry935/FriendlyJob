using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs.CreateDTOs
{
    public class CreateOpinionDto
    {
        [Required(ErrorMessage = "Opis jest wymagany")]
        public string Content { get; set; }
        public bool Anonymous { get; set; }
        public int CompanyId { get; set; }
    }
}
