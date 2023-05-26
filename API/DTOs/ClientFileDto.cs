namespace API.DTOs
{
    public class ClientFileDto
    {
        public PutClientDto Client { get; set; }
        public List<SalesWithoutClientDto> Sales { get; set; }
    }
}