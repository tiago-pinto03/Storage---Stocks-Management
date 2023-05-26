using API.Entities;

namespace API.DTOs
{
    public class SalesWithoutClientDto
    {
        public Guid? Id { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public ProductDto Product { get; set; }
        public PutEmployeeDto Employee { get; set; }
    }
}