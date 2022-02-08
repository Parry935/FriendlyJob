﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Description { get; set; }
        public string ImageSrc { get; set; }
        public bool Lock { get; set; }
    }
}
