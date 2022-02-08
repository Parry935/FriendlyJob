using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class OpinionDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string Date { get; set; }
        public List<int> UsersIdLikes { get; set; }
        public List<int> UsersIdDislikes { get; set; }
        public UserDto User { get; set; }
    }
}
