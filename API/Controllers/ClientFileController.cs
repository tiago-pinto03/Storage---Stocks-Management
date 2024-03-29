using API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [Authorize]
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


        [HttpGet("/get/{nif}")]
        public async Task<ActionResult<ClientFileDto>> GetSalesByClientNif(int nif)
        {
            var sales = await _context.Sales
                .Include(s => s.Product)
                .Include(s => s.Client)
                .Include(s => s.Employee)
                .Where(d => d.Client.NIF == nif)
                .ToListAsync();

            var clientNif = await _context.Clients.FirstOrDefaultAsync(x => x.NIF == nif);

            if (clientNif == null)
            {
                return BadRequest("Client doesn't exist!");
            }

            if (sales.Count == 0)
            {
                return BadRequest("Client has no buys!");
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
                    Id = clientNif.Id,
                    Name = clientNif.Name,
                    Email = clientNif.Email,
                    NIF = clientNif.NIF,
                    Phone = clientNif.Phone
                },
                Sales = salesWithoutClientDtos
            };

            return Ok(clientFileDto);
        }

        
        [HttpPut("{nif}")]
        public async Task<ActionResult<IEnumerable<PutClientDto>>> PutUser(int nif, PutClientDto putClientDto)
        {
            var cli = await _context.Clients.SingleOrDefaultAsync(x => x.NIF == putClientDto.NIF);

            if (cli == null) return Unauthorized("Invalid NIF");

            cli.Name = putClientDto.Name;
            cli.Email = putClientDto.Email;
            cli.NIF = putClientDto.NIF;
            cli.Phone = putClientDto.Phone;

            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}