using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs.CreateDTOs
{
    public class CreateTechnologyDto
    {
        [Required(ErrorMessage = "Nazwa jest wymagana")]
        public string Name { get; set; }
    }
}
