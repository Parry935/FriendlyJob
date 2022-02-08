using api_server.Entities;
using api_server.Utility;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Opinion> Opinions { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<JobOffer> JobOffers { get; set; }
        public DbSet<ProgrammerOffer> ProgrammerOffers { get; set; }
        public DbSet<Technology> Technologies { get; set; }
        public DbSet<JobOfferTechnology> JobOfferTechnologies { get; set; }
        public DbSet<ProgrammerOfferTechnology> ProgrammerOfferTechnologies { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<JobOffer>()
                .Property(p => p.Salary)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<JobOffer>()
               .Property(p => p.Experience)
               .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<ProgrammerOffer>()
                .Property(p => p.Experience)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<JobOfferTechnology>()
                .HasKey(m => new { m.JobOfferId, m.TechnologyId });
            modelBuilder.Entity<JobOfferTechnology>()
                .HasOne(m => m.JobOffer)
                .WithMany(i => i.JobOfferTechnologies)
                .HasForeignKey(m => m.JobOfferId);
            modelBuilder.Entity<JobOfferTechnology>()
                .HasOne(m => m.Technology)
                .WithMany(i => i.JobOfferTechnologies)
                .HasForeignKey(m => m.TechnologyId);

            modelBuilder.Entity<ProgrammerOfferTechnology>()
                .HasKey(m => new { m.ProgrammerOfferId, m.TechnologyId });
            modelBuilder.Entity<ProgrammerOfferTechnology>()
                .HasOne(m => m.ProgrammerOffer)
                .WithMany(i => i.ProgrammerOfferTechnologies)
                .HasForeignKey(m => m.ProgrammerOfferId);
            modelBuilder.Entity<ProgrammerOfferTechnology>()
                .HasOne(m => m.Technology)
                .WithMany(i => i.ProgrammerOfferTechnologies)
                .HasForeignKey(m => m.TechnologyId);
        }
    }
}
