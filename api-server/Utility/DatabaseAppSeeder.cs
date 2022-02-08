using api_server.Database;
using api_server.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Utility
{
    public class DatabaseAppSeeder
    {
        private readonly AppDbContext _db;
        private readonly IPasswordHasher<User> _passwordHasher;

        public DatabaseAppSeeder(AppDbContext db, IPasswordHasher<User> passwordHasher)
        {
            _db = db;
            _passwordHasher = passwordHasher;
        }

        public void Seed()
        {
            if (_db.Database.CanConnect())
            {
                var pendingMigrations = _db.Database.GetPendingMigrations();

                if (pendingMigrations != null && pendingMigrations.Any())
                {
                    _db.Database.Migrate();
                }

                if (!_db.Roles.Any())
                {
                    var roles = GetRolesApp();
                    _db.Roles.AddRange(roles);
                    _db.SaveChanges();
                }

                if (!_db.Users
                    .Include(m => m.Role)
                    .Where( m => m.Role.Name == AppConfiguration.AppRole.Admin.ToString())
                    .Any())
                {
                    var admin = GetAdminAccount();
                    _db.Users.Add(admin);
                    _db.SaveChanges();
                }
            }
        }

        private User GetAdminAccount()
        {
            var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();

            var user = new User()
            {
                Email = config["AdminAccount:Email"],
                FirstName = config["AdminAccount:FirstName"],
                LastName = config["AdminAccount:LastName"],
                Lock = false,
                RoleId =  _db.Roles
                    .Where(m => m.Name == AppConfiguration.AppRole.Admin.ToString())
                    .Select(m => m.Id)
                    .First()
        };

            var hashedPassword = _passwordHasher.HashPassword(user, config["AdminAccount:Password"]);

            user.Password = hashedPassword;

            return user;
        }

        private IEnumerable<Role> GetRolesApp()
        {
            var roles = new List<Role>()
            {
                new Role()
                {
                    Name = AppConfiguration.AppRole.Admin.ToString()
                },
                new Role()
                {
                    Name = AppConfiguration.AppRole.Programmer.ToString()
                },
                new Role()
                {
                    Name = AppConfiguration.AppRole.Company.ToString()
                },
            };

            return roles;
        }
    }
}
