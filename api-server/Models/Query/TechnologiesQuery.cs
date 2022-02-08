using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Models.Query
{
    public class TechnologiesQuery
    {
        public int Count { get; set; }
        public bool MostPopular { get; set; }
        public string Phrase { get; set; }
    }
}
