using api_server.Models;
using api_server.Models.DTOs;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Interfaces.Services
{
    public interface IAccountService
    {
        Task RegisterUserAsync(RegisterDto registerDto);
        Task<string> GenerateJwtAsync(LoginDto loginDto);
        Task<UserWithCompanyDto> GetAccountByIdAsync(int id);
        Task<UserWithCompanyDto> GetAccountByEmailAsync(string email);
        Task<IEnumerable<UserWithCompanyAndEmailDto>> GetAccountsAsync(string phrase, int page);
        Task<UserWithCompanyDto> EditAccountAsync(int id, UserWithCompanyDto user);
        Task<UserWithCompanyDto> GetCurrentUserAsync();
        Task EditPasswordAsync(int id, string newPassword);
        Task<string> UploadImageAsync(int id, IFormFile file);
        Task DeleteImageAsync(int id);
        Task<CompanyWithUserDto> GetCompanyByIdAsync(int id);
        Task EditLockAsync(int id);
    }
}
