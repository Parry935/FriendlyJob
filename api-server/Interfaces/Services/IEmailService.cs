using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Interfaces.Services
{
    public interface IEmailService
    {
        void SendEmailRegister(string recipient, string password, string role);
        void SendEmailPasswordChange(string recipient, string password);
        void SendEmailNewMessage(string recipient, string user);
    }
}
