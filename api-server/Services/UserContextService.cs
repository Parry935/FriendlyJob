using api_server.Exceptions;
using api_server.Interfaces.Services;
using api_server.Utility;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace api_server.Services
{
    public class UserContextService : IUserContextService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserContextService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public ClaimsPrincipal User => _httpContextAccessor.HttpContext?.User;

        public int? GetUserId =>
            User is null ? null : (int?)int.Parse(User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier).Value);

        public void CheckAccessByUserId(int id)
        {
            if (!User.IsInRole(AppConfiguration.AppRole.Admin.ToString()))
            {
                if (GetUserId != id)
                    throw new ForbiddenException("Brak dostępu");
            }
        }
    }
}
