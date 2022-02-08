using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs.CreateDTOs
{
    public class CreateJobApplicationDto
    {
        [Required(ErrorMessage = "Opis jest wymagany")]
        public string Description { get; set; }
        public int OfferId { get; set; }
    }
}
