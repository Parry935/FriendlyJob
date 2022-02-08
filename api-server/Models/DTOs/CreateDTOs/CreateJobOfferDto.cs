using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api_server.Models.DTOs.CreateDTOs
{
    public class CreateJobOfferDto
    {
        [Required(ErrorMessage = "Tytuł jest wymagany")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Lokalizacja jest wymagany")]
        public string Localization { get; set; }

        [Range(0.0, Double.MaxValue, ErrorMessage = "Niepoprawna wartość zarobków")]
        public decimal? Salary { get; set; }

        [Range(0.0, Double.MaxValue, ErrorMessage = "Niepoprawna wartość zarobków doświadczenia")]
        public decimal? Experience { get; set; }
        public bool? Remote { get; set; }
        public string Level { get; set; }
        public string Language { get; set; }
        public bool ContractP { get; set; }
        public bool ContractB { get; set; }
        public bool ContractM { get; set; }
        public string Time { get; set; }

        [Required(ErrorMessage = "Opis jest wymagany")]
        public string Description { get; set; }
        public List<string> TechnologyMain { get; set; }
        public List<string> TechnologyNiceToHave { get; set; }
    }
}