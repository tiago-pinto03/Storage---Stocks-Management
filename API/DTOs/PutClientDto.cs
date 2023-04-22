using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class PutClientDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int NIF { get; set; }
        public long Phone { get; set; }
    }
}