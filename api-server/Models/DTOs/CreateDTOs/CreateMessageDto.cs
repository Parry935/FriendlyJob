using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs.CreateDTOs
{
    public class CreateMessageDto
    {
        [Required(ErrorMessage = "Treść jest wymagana")]
        public string Content { get; set; }
        public int? RecipientId { get; set; }
        public int? SenderId { get; set; }
    }
}
