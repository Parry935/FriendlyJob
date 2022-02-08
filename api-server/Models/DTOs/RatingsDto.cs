using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class RatingsDto
    {
        public List<int> UsersIdLikes { get; set; }
        public List<int> UsersIdDislikes { get; set; }
    }
}
