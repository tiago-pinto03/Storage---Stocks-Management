using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterClientDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public int NIF { get; set; }
    }
}