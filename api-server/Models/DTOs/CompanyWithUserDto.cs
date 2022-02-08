namespace api_server.Models.DTOs
{
    public class CompanyWithUserDto
    {
        public int Id { get; set; }
        public string NIP { get; set; }
        public string Name { get; set; }
        public UserDto User { get; set; }
    }
}