using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class ReportDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Powód jest wymagany")]
        public string Reason { get; set; }
        public string Date { get; set; }
        public UserWithCompanyDto User { get; set; }
        public OpinionForReportsDto Opinion { get; set; }
    }
}
