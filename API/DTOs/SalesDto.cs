namespace API.DTOs
{
    public class SalesDto
    {
        public Guid? Id { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public Guid? ProductId { get; set; }
        public Guid? ClientId { get; set; }
        public Guid? EmployeeId { get; set; }
    }
}