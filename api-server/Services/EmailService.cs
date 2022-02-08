using api_server.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;

namespace api_server.Services
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;
        private readonly IConfigurationRoot _config;
        private readonly string _testEmail = "dominikpepas@gmail.com";

        public EmailService(ILogger<EmailService> logger)
        {
            _logger = logger;
            _config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
        }

        public void SendEmailRegister(string recipient, string password, string role)
        {
            var smtpClient = CreateSmtpClinet();

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_config["Smtp:Username"]),
                Subject = "Rejestracja",
                Body = "<h2> Dzień dobry,</h2>" +
                $"<p>Dziękujemy za rejestrację w naszej aplikacji jako <b>{role}</b>. Mamy nadzieję, że aplikacja spełni twoje oczekiwania.<p>" + 
                $"<p>Twoje hasło: <b>{password}</b><p>",
                IsBodyHtml = true,
            };
            mailMessage.To.Add(_testEmail);

            SendMailMessage(smtpClient, mailMessage);
        }

        public void SendEmailPasswordChange(string recipient, string password)
        {
            var smtpClient = CreateSmtpClinet();

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_config["Smtp:Username"]),
                Subject = "Zmiana hasła",
                Body = "<h2> Dzień dobry,</h2>" +
                "<p>Twoje hasło do konta zostało zmienione.<p>" +
                $"<p>Twoje nowe hasło: <b>{password}</b><p>",
                IsBodyHtml = true,
            };
            mailMessage.To.Add(_testEmail);

            SendMailMessage(smtpClient, mailMessage);
        }

        public void SendEmailNewMessage(string recipient, string user)
        {
            var smtpClient = CreateSmtpClinet();

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_config["Smtp:Username"]),
                Subject = "Dostałeś nową wiadomość",
                Body = "<h2> Dzień dobry,</h2>" +
                $"<p>Użytkownik <b>{user}</b> wysłał Ci nową wiadmość.<p>",
                IsBodyHtml = true,
            };
            mailMessage.To.Add(_testEmail);

            SendMailMessage(smtpClient, mailMessage);
        }

        private SmtpClient CreateSmtpClinet()
        {
            var smtpClient = new SmtpClient(_config["Smtp:Host"])
            {
                Port = int.Parse(_config["Smtp:Port"]),
                Credentials = new NetworkCredential(_config["Smtp:Username"], _config["Smtp:Password"]),
                EnableSsl = true,
            };

            return smtpClient;
        }


        private void SendMailMessage(SmtpClient smtpClient, MailMessage mailMessage)
        {
            try
            {
                smtpClient.Send(mailMessage);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
            }
        }
    }
}
