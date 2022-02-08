using api_server.Database;
using api_server.Entities;
using api_server.Exceptions;
using api_server.Interfaces.Services;
using api_server.Models;
using api_server.Models.DTOs;
using api_server.Utility;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace api_server.Services
{
    public class AccountService : IAccountService
    {
        private readonly AppDbContext _db;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly AuthenticationSettings _authenticationSettings;
        private readonly IUserContextService _userContextService;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public AccountService(AppDbContext db, IPasswordHasher<User> passwordHasher, 
            AuthenticationSettings authenticationSettings, IUserContextService userContextService, IMapper mapper, IEmailService emailService)
        {
            _db = db;
            _passwordHasher = passwordHasher;
            _authenticationSettings = authenticationSettings;
            _userContextService = userContextService;
            _mapper = mapper;
            _emailService = emailService;
        }
        public async Task RegisterUserAsync(RegisterDto registerDto)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(m => m.Email.ToUpper() == registerDto.Email.Trim().ToUpper());

            if (user is not null)
                throw new BadRequestException("Konto na podany email już istnieje");

            var userToDb = new User()
            {
                Email = registerDto.Email.Trim(),
                FirstName = registerDto.FirstName.Trim(),
                LastName = registerDto.LastName.Trim(),
                Description = "",
                Lock = false
            };

            if ((string.IsNullOrEmpty(registerDto.NIP) && !string.IsNullOrEmpty(registerDto.CompanyName)) ||
                (!string.IsNullOrEmpty(registerDto.NIP) && string.IsNullOrEmpty(registerDto.CompanyName)))
                throw new BadRequestException("By zarejestrować się jako fimra należy podać nazwę oraz NIP");

            if (!string.IsNullOrEmpty(registerDto.NIP) && !string.IsNullOrEmpty(registerDto.CompanyName))
            {
                if(registerDto.CompanyName.All(char.IsWhiteSpace))
                    throw new BadRequestException("Nazwa firmy nie może składać się z samych pustych znaków");

                if (registerDto.NIP.Length != 9 || !registerDto.NIP.All(char.IsDigit))
                    throw new BadRequestException("NIP powinien zawierać 9 cyfr");

                if (await _db.Companies.FirstOrDefaultAsync(m => m.NIP == registerDto.NIP.Trim()) is not null)
                    throw new BadRequestException("Konto dla firmy o podanym NIP już istnieje");

                if (await _db.Companies.FirstOrDefaultAsync(m => m.Name.ToUpper() == registerDto.CompanyName.Trim().ToUpper()) is not null)
                    throw new BadRequestException("Konto dla firmy o podanej nazwie już istnieje");

                userToDb.Company = new Company()
                {
                    NIP = registerDto.NIP,
                    Name = registerDto.CompanyName.Trim()
                };
                userToDb.RoleId = await _db.Roles
                    .Where(m => m.Name == AppConfiguration.AppRole.Company.ToString())
                    .Select(m => m.Id)
                    .FirstAsync();
            }
            else
            {
                userToDb.RoleId = await _db.Roles
                    .Where(m => m.Name == AppConfiguration.AppRole.Programmer.ToString())
                    .Select(m => m.Id)
                    .FirstAsync();
            }

            var hashedPassword = _passwordHasher.HashPassword(userToDb, registerDto.Password);

            userToDb.Password = hashedPassword;
            _db.Users.Add(userToDb);
            await _db.SaveChangesAsync();

            //_emailService.SendEmailRegister(userToDb.Email, dto.Password, ((AppConfiguration.AppRole)userToDb.RoleId).ToString());
        }

        public async Task<string> GenerateJwtAsync(LoginDto loginDto)
        {
            var user = await _db.Users
                .Include(m => m.Role)
                .FirstOrDefaultAsync(m => m.Email == loginDto.Email);

            if (user is null)
                throw new BadRequestException("Błędny email lub hasło");

            var result = _passwordHasher.VerifyHashedPassword(user, user.Password, loginDto.Password);

            if (result == PasswordVerificationResult.Failed)
                throw new BadRequestException("Błędny email lub hasło");

            if(user.Lock == true)
                throw new BadRequestException("Konto zablokowane");

            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Role, $"{user.Role.Name}"),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authenticationSettings.JwtKey));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(_authenticationSettings.JwtExpireDays);

            var token = new JwtSecurityToken(_authenticationSettings.JwtIssuer,
                _authenticationSettings.JwtIssuer,
                claims,
                expires: expires,
                signingCredentials: cred);

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(token);

        }

        public async Task<UserWithCompanyDto> GetAccountByIdAsync(int id)
        {
            var user = await _db.Users.Include(m => m.Company).Include(m => m.Role).FirstOrDefaultAsync(m => m.Id == id);

            if (user is null)
                throw new NotFoundException();

            return _mapper.Map<UserWithCompanyDto>(user);
        }

        public async Task<UserWithCompanyDto> GetAccountByEmailAsync(string email)
        {
            if(email is null)
                throw new BadRequestException();

            var user = await _db.Users.Include(m => m.Company).Include(m => m.Role).FirstOrDefaultAsync(m => m.Email.Equals(email));

            if (user is null)
                throw new NotFoundException();

            return _mapper.Map<UserWithCompanyDto>(user);
        }

        public async Task<IEnumerable<UserWithCompanyAndEmailDto>> GetAccountsAsync(string phrase, int page)
        {
            if (page <= 0)
                throw new BadRequestException();

            var users = await _db.Users
                .Include(m => m.Company)
                .Include(m => m.Role)
                .Where(m => phrase != null ?
                m.FirstName.ToUpper().Contains(phrase.ToUpper()) ||
                m.LastName.ToUpper().Contains(phrase.ToUpper()) ||
                m.Email.ToUpper().Contains(phrase.ToUpper()) ||
                (m.Company != null ? m.Company.Name.ToUpper().Contains(phrase.ToUpper()) : false) 
                : true)
                .ToListAsync();

            users = users.Skip(AppConfiguration.pageSize * (page - 1)).Take(AppConfiguration.pageSize).ToList();

            return _mapper.Map<IEnumerable<UserWithCompanyAndEmailDto>>(users);
        }

        public async Task<UserWithCompanyDto> EditAccountAsync(int id, UserWithCompanyDto user)
        {
            _userContextService.CheckAccessByUserId(id);

            var userFromDb = await _db.Users.Include(m => m.Company).Include(m => m.Role).FirstOrDefaultAsync(m => m.Id == id);

            if (userFromDb is null)
                throw new NotFoundException();

            UpdateUserValues(userFromDb, user);

            await _db.SaveChangesAsync();

            return _mapper.Map<UserWithCompanyDto>(userFromDb);
        }

        private void UpdateUserValues(User userFromDb, UserWithCompanyDto user)
        {
            userFromDb.FirstName = user.FirstName.Trim();
            userFromDb.LastName = user.LastName.Trim();
            userFromDb.Description = user.Description;

            if (userFromDb.Company is not null)
            {
                if(string.IsNullOrEmpty(user.Company.Name))
                    throw new BadRequestException("Nie podano nazwy firmy");

                if (user.Company.Name.All(char.IsWhiteSpace))
                    throw new BadRequestException("Nazwa firmy nie może składać się z samych pustych znaków");

                if (string.IsNullOrEmpty(user.Company.NIP))
                    throw new BadRequestException("Nie podano NIPu");

                if (user.Company.NIP.Length != 9 || !user.Company.NIP.All(char.IsDigit))
                    throw new BadRequestException("NIP powinien zawierać 9 cyfr");

                if (user.Company.NIP != userFromDb.Company.NIP)
                {
                    if (_db.Companies.FirstOrDefault(m => m.NIP == user.Company.NIP) is not null)
                        throw new BadRequestException("Konto dla firmy o podanym NIP już istnieje");
                }

                if (user.Company.Name.Trim().ToUpper() != userFromDb.Company.Name.ToUpper())
                {
                    if (_db.Companies.FirstOrDefault(m => m.Name.ToUpper() == user.Company.Name.Trim().ToUpper()) is not null)
                        throw new BadRequestException("Konto dla firmy o podanej nazwie już istnieje");
                }

                userFromDb.Company.Name = user.Company.Name.Trim();
                userFromDb.Company.NIP = user.Company.NIP;
            }

        }

        public async Task<UserWithCompanyDto> GetCurrentUserAsync()
        {
            var userId =  _userContextService.GetUserId;

            if(userId is null)
                throw new NotFoundException();

            var user = await _db.Users.Include(m => m.Company).Include(m => m.Role).FirstOrDefaultAsync(m => m.Id == userId);

            if (user is null)
                throw new NotFoundException();

            return _mapper.Map<UserWithCompanyDto>(user);
        }

        public async Task EditPasswordAsync(int id, string newPassword)
        {
            _userContextService.CheckAccessByUserId(id);

            var userFromDb = await _db.Users.FirstOrDefaultAsync(m => m.Id == id);

            if (userFromDb is null)
                throw new NotFoundException();

            if (newPassword.Length < 5)
                throw new BadRequestException("Hasło powinno zawierać minimum 5 znaków");

            var hashedPassword = _passwordHasher.HashPassword(userFromDb, newPassword);

            userFromDb.Password = hashedPassword;

            await _db.SaveChangesAsync();

            //_emailService.SendEmailPasswordChange(userFromDb.Email, newPassword);
        }

        public async Task<string> UploadImageAsync(int id, IFormFile file)
        {
            _userContextService.CheckAccessByUserId(id);

            var userFromDb = await _db.Users.FirstOrDefaultAsync(m => m.Id == id);

            if (userFromDb is null)
                throw new NotFoundException();

            if (file == null || file.Length <= 0)
                throw new BadRequestException("Nie przesłano zdjecia");

            DeleteImageFromDirectoryIfExist(id);

            var dateNow = DateTime.Now.ToString("yyyyMMddTHHmmss");
            var rootPath = Directory.GetCurrentDirectory();
            var extension = Path.GetExtension(file.FileName);
            var fullPath = $"{rootPath}/wwwroot/UserPhoto/{dateNow}_{userFromDb.Id}{extension}";
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            userFromDb.ImageSrc = string.Concat(dateNow, "_", userFromDb.Id, extension);

            await _db.SaveChangesAsync();

            return userFromDb.ImageSrc;
        }

        public async Task DeleteImageAsync(int id)
        {
            _userContextService.CheckAccessByUserId(id);

            var userFromDb = await _db.Users.FirstOrDefaultAsync(m => m.Id == id);

            if (userFromDb is null)
                throw new NotFoundException();

            if (DeleteImageFromDirectoryIfExist(id) == 0)
                throw new BadRequestException("Nie znaleziono zdjęcia do usunięcia");

            userFromDb.ImageSrc = null;

            await _db.SaveChangesAsync();
        }

        private int DeleteImageFromDirectoryIfExist(int userId)
        {
            var rootPath = Directory.GetCurrentDirectory();
            var path = $"{rootPath}/wwwroot/UserPhoto";

            var files = Directory.GetFiles(path,$"*_{userId}.*");

            foreach (var item in files)
            {
                if (System.IO.File.Exists(item))
                {
                    System.IO.File.Delete(item);
                }
            }

            return files.Length;
        }

        public async Task<CompanyWithUserDto> GetCompanyByIdAsync(int id)
        {
            var company = await _db.Companies.Include(m => m.User).FirstOrDefaultAsync(m => m.Id == id);

            if (company is null)
                throw new NotFoundException("Nie znaleziono firmy");

            return _mapper.Map<CompanyWithUserDto>(company);
        }

        public async Task EditLockAsync(int id)
        {
            var userFromDb = await _db.Users.FirstOrDefaultAsync(m => m.Id == id);

            if (userFromDb is null)
                throw new NotFoundException();

            if (userFromDb.Lock == true)
                userFromDb.Lock = false;
            else
                userFromDb.Lock = true;

            await _db.SaveChangesAsync();
        }
    }
}
