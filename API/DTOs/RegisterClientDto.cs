using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterClientDto
    {
        [Required]
        public string Name { get; set; }
        
        [Required]
        public string Email { get; set; }

        [Required]
        public int NIF { get; set; }
    }
}