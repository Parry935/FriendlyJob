using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class UpdateOpinionDto
    {
        [Required(ErrorMessage = "Opis jest wymagany")]
        public string Content { get; set; }
    }
}
