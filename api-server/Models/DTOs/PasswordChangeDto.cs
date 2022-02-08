using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class PasswordChangeDto
    {
        [Required(ErrorMessage = "Nie podano nowego hasła")]
        public string NewPassword { get; set; }
    }
}
