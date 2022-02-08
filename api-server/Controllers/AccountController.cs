using api_server.Interfaces.Services;
using api_server.Models;
using api_server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser([FromBody] RegisterDto registerDto)
        {
            await _accountService.RegisterUserAsync(registerDto);
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginDto loginDto)
        {
            var token = await _accountService.GenerateJwtAsync(loginDto);

            return Ok(token);
        }

        [HttpGet("currentUser")]
        public async Task<ActionResult<UserWithCompanyDto>> GetCurrentUser()
        {
            var account = await _accountService.GetCurrentUserAsync();

            return Ok(account);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<UserWithCompanyDto>> GetAccountById([FromRoute] int id)
        {
            var account = await _accountService.GetAccountByIdAsync(id);

            return Ok(account);
        }

        [HttpGet("company/{id:int}")]
        public async Task<ActionResult<CompanyWithUserDto>> GetCompanyById([FromRoute] int id)
        {
            var company = await _accountService.GetCompanyByIdAsync(id);

            return Ok(company);
        }

        [HttpGet("{email}")]
        public async Task<ActionResult<UserWithCompanyDto>> GetAccountByEmail([FromRoute] string email)
        {
            var account = await _accountService.GetAccountByEmailAsync(email);

            return Ok(account);
        }

        [Authorize(Roles ="Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserWithCompanyAndEmailDto>>> GetAccounts([FromQuery] string Phrase, [FromQuery] int Page)
        {
            var accounts = await _accountService.GetAccountsAsync(Phrase, Page);

            return Ok(accounts);
        }

        [HttpPatch("{id:int}")]
        public async Task<ActionResult<UserWithCompanyDto>> EditAccount([FromRoute] int id, [FromBody] UserWithCompanyDto user)
        {
            var account = await _accountService.EditAccountAsync(id, user);

            return Ok(account);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("lock/{id:int}")]
        public async Task<ActionResult> EditLock([FromRoute] int id)
        {
            await _accountService.EditLockAsync(id);

            return Ok();
        }

        [HttpPatch("password/{id:int}")]
        public async Task<ActionResult> EditPassword([FromRoute] int id, [FromBody] PasswordChangeDto passwordChangeDto)
        {
            await _accountService.EditPasswordAsync(id, passwordChangeDto.NewPassword);

            return Ok();
        }

        [HttpPost("image/{id:int}")]
        public async Task<ActionResult<string>> UploadImage([FromRoute] int id, [FromForm] IFormFile file)
        {
            var path = await _accountService.UploadImageAsync(id, file);

            return Ok(path);
        }

        [HttpDelete("image/{id:int}")]
        public async Task<ActionResult> DeleteImage([FromRoute] int id)
        {
            await _accountService.DeleteImageAsync(id);

            return NoContent();
        }
    }
}
