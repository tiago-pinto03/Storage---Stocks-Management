namespace API.DTOs
{
    public class PutEmployeeDto
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public long Phone { get; set; }
        public bool IsAdmin { get; set; }
    }
}