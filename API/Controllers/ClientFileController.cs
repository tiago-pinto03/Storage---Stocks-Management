using API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.DTOs;

namespace API.Controllers
{
    public class ClientFileController : BaseApiController
    {
        private readonly DataContext _context;

        public ClientFileController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClientFileDto>> GetSalesByClientId(Guid id)
        {
            var sales = await _context.Sales
                .Include(s => s.Product)
                .Include(s => s.Client)
                .Include(s => s.Employee)
                .Where(d => d.Client.Id == id)
                .ToListAsync();

            var findClient = await _context.Clients.FindAsync(id);

            if (findClient == null)
            {
                return BadRequest("Client doesn't exist!");
            }

            if (sales.Count == 0)
            {
                return BadRequest("Client has no buys!");
            }

            var clientId = await _context.Clients.FirstOrDefaultAsync(x => x.Id == id);

            if (clientId == null)
            {
                return NotFound();
            }

            var salesWithoutClientDtos = sales.Select(s => new SalesWithoutClientDto
            {
                Id = s.Id,
                Product = new ProductDto
                {
                    Id = s.Product.Id,
                    Name = s.Product.Name
                },
                Quantity = s.Quantity,
                Price = s.Price,
                Employee = new PutEmployeeDto
                {
                    Id = s.Employee.Id,
                    Name = s.Employee.Name
                }
            }).ToList();

            var clientFileDto = new ClientFileDto
            {
                Client = new PutClientDto
                {
                    Id = clientId.Id,
                    Name = clientId.Name,
                    Email = clientId.Email,
                    NIF = clientId.NIF,
                    Phone = clientId.Phone
                },
                Sales = salesWithoutClientDtos
            };

            return Ok(clientFileDto);
        }

    }
}