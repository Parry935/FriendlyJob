using api_server.Database;
using api_server.Entities;
using api_server.Interfaces.Services;
using api_server.Middleware;
using api_server.Services;
using AutoMapper;
using api_server.Utility;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api_server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            #region authentication config

            var authenticationSettings = new AuthenticationSettings();

            Configuration.GetSection("Authentication").Bind(authenticationSettings);

            services.AddSingleton(authenticationSettings);
            services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = "Bearer";
                option.DefaultScheme = "Bearer";
                option.DefaultChallengeScheme = "Bearer";
            }).AddJwtBearer(configuration =>
            {
                configuration.RequireHttpsMetadata = false;
                configuration.SaveToken = true;
                configuration.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = authenticationSettings.JwtIssuer,
                    ValidAudience = authenticationSettings.JwtIssuer,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationSettings.JwtKey)),
                };
            });

            #endregion

            services.AddDbContext<AppDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            services.AddControllers().AddNewtonsoftJson();
            services.AddAutoMapper(this.GetType().Assembly);
            services.AddScoped<ErrorHandlingMiddleware>();
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
            services.AddScoped<IUserContextService, UserContextService>();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "api_server", Version = "v1" });
            });

            services.Configure<ApiBehaviorOptions>(o =>
            {
                o.InvalidModelStateResponseFactory = actionContext =>
                    new BadRequestObjectResult(actionContext.ModelState
                    .Select(m => m.Value.Errors.Select(r => r.ErrorMessage)
                    .FirstOrDefault()).ToList());
            });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>

                    builder.AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowAnyOrigin()
                    );
            });

            services.AddScoped<DatabaseAppSeeder>();

            #region controllers-services

            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IMessagesService, MessagesService>();
            services.AddScoped<IOpinionsService, OpinionsService>();
            services.AddScoped<IRatingsService, RatingsService>();
            services.AddScoped<IReportsService, ReportsService>();
            services.AddScoped<IJobOffersService, JobOffersService>();
            services.AddScoped<IProgrammerOffersService, ProgrammerOffersService>();
            services.AddScoped<ITechnologiesService, TechnologiesService>();
            services.AddScoped<IJobApplicationsService, JobApplicationsService>();
            services.AddScoped<IEmailService, EmailService>();

            #endregion
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DatabaseAppSeeder appSeeder)
        {
            app.UseCors("AllowAll");

            app.UseResponseCaching();

            app.UseStaticFiles();

            appSeeder.Seed();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "api_server v1"));
            }

            app.UseMiddleware<ErrorHandlingMiddleware>();

            app.UseAuthentication();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
