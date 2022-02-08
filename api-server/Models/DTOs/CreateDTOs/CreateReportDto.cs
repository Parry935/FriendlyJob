using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs.CreateDTOs
{
    public class CreateReportDto
    {
        [Required(ErrorMessage = "Powód jest wymagany")]
        public string Reason { get; set; }
        public int OpinionId { get; set; }
    }
}
