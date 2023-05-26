namespace API.DTOs
{
    public class ClientDto
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int NIF { get; set; }
        /* public string Token { get; set; } */
    }
}