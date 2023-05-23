using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.DTOs;

namespace API.Controllers
{
    public class SalesController : BaseApiController
    {
        private readonly DataContext _context;

        public SalesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/sales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesDto>>> GetSales()
        {
            var sales = await _context.Sales
                .Include(s => s.Product)
                .Include(s => s.Client)
                .Include(s => s.Employee)
                .ToListAsync();

            var salesDtoList = sales.Select(s => new SalesDto
            {
                Id = s.Id,
                Price = s.Price,
                Quantity = s.Quantity,
                ProductId = s.Product.Id,
                ClientId = s.Client.Id,
                EmployeeId = s.Employee.Id
            }).ToList();

            return Ok(salesDtoList);
        }

        // GET: api/sales/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<SalesDto>> GetSalesById(Guid id)
        {
            var sales = await _context.Sales
                .Include(s => s.Product)
                .Include(s => s.Client)
                .Include(s => s.Employee)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sales == null)
            {
                return NotFound();
            }

            var salesDto = new SalesDto
            {
                Id = sales.Id,
                Price = sales.Price,
                Quantity = sales.Quantity,
                ProductId = sales.Product.Id,
                ClientId = sales.Client.Id,
                EmployeeId = sales.Employee.Id
            };

            return Ok(salesDto);
        }

        // POST: api/sales
        [HttpPost]
        public async Task<ActionResult<SalesDto>> CreateSales(SalesDto salesCreateDto)
        {
            var product = await _context.Products.FindAsync(salesCreateDto.ProductId);
            var client = await _context.Clients.FindAsync(salesCreateDto.ClientId);
            var employee = await _context.Employees.FindAsync(salesCreateDto.EmployeeId);

            if (product == null || client == null || employee == null)
            {
                return BadRequest("Invalid Product, Client, or Employee ID");
            }

            if (salesCreateDto.Quantity <= 0)
            {
                return BadRequest("Invalid Quantity");
            }

            if (salesCreateDto.Quantity > product.Quantity)
            {
                return BadRequest("Insufficient quantity of the product");
            }

            product.Quantity -= salesCreateDto.Quantity;

            if(product.Quantity == 0)
            {product.Available = false;}

            var sales = new Sales
            {
                Price = salesCreateDto.Price,
                Quantity = salesCreateDto.Quantity,
                Product = product,
                Client = client,
                Employee = employee
            };

            if (sales.Price <= 0)
            {
                return BadRequest("Invalid Price");
            }

            _context.Sales.Add(sales);
            await _context.SaveChangesAsync();

            var createdDto = new SalesDto
            {
                Id = sales.Id,
                Price = sales.Price,
                Quantity = sales.Quantity,
                ProductId = sales.Product.Id,
                ClientId = sales.Client.Id,
                EmployeeId = sales.Employee.Id
            };

            return CreatedAtAction(nameof(GetSalesById), new { id = sales.Id }, createdDto);
        }

        // PUT: api/sales/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSales(Guid id, SalesDto salesUpdateDto)
        {
            var sales = await _context.Sales
                .Include(s => s.Product)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sales == null)
            {
                return NotFound();
            }

            var product = await _context.Products.FindAsync(salesUpdateDto.ProductId);
            var client = await _context.Clients.FindAsync(salesUpdateDto.ClientId);
            var employee = await _context.Employees.FindAsync(salesUpdateDto.EmployeeId);

            if (product == null || client == null || employee == null)
            {
                return BadRequest("Invalid Product, Client, or Employee ID");
            }

            if (salesUpdateDto.Quantity <= 0)
            {
                return BadRequest("Invalid Quantity");
            }

            if (salesUpdateDto.Quantity > product.Quantity)
            {
                return BadRequest("Insufficient quantity of the product");
            }

            sales.Price = salesUpdateDto.Price;
            sales.Quantity = salesUpdateDto.Quantity;
            sales.Product = product;
            sales.Client = client;
            sales.Employee = employee;

            if (sales.Price <= 0)
            {
                return BadRequest("Invalid Price");
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }


        // DELETE: api/sales/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSales(Guid id)
        {
            var sales = await _context.Sales.FindAsync(id);

            if (sales == null)
            {
                return NotFound();
            }

            _context.Sales.Remove(sales);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}