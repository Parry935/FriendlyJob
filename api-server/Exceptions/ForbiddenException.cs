using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Exceptions
{
    public class ForbiddenException : Exception
    {

        public ForbiddenException(string message) : base(message)
        {

        }


        public ForbiddenException() : base("Brak dostępu do zasobów")
        {

        }

    }
}
