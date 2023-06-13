using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [Authorize] 
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
                Product = new ProductDto
                {
                    Id = s.Product.Id,
                    Name = s.Product.Name
                },
                Client = new ClientDto
                {
                    Id = s.Client.Id,
                    Name = s.Client.Name,
                    NIF = s.Client.NIF
                },
                Employee = new PutEmployeeDto
                {
                    Id = s.Employee.Id,
                    Name = s.Employee.Name
                }
            }).ToList();


            return Ok(salesDtoList);
        }

        // GET: api/sales/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<SalesDto>> GetSalesById(Guid id)
        {
            var sale = await _context.Sales
                .Include(s => s.Product)
                .Include(s => s.Client)
                .Include(s => s.Employee)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sale == null)
            {
                return NotFound();
            }

            var salesDto = new SalesDto
            {
                Id = sale.Id,
                Price = sale.Price,
                Quantity = sale.Quantity,
                Product = new ProductDto
                {
                    Id = sale.Product.Id,
                    Name = sale.Product.Name
                },
                Client = new ClientDto
                {
                    Id = sale.Client.Id,
                    Name = sale.Client.Name,
                    NIF = sale.Client.NIF
                },
                Employee = new PutEmployeeDto
                {
                    Id = sale.Employee.Id,
                    Name = sale.Employee.Name
                }
            };

            return Ok(salesDto);
        }


        // POST: api/sales
        [HttpPost]
        public async Task<ActionResult<SalesDto>> CreateSales(SalesDto salesCreateDto)
        {
            var product = await _context.Products.FindAsync(salesCreateDto.Product.Id);
            var client = await _context.Clients.FindAsync(salesCreateDto.Client.Id);
            var employee = await _context.Employees.FindAsync(salesCreateDto.Employee.Id);

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
            salesCreateDto.Price = product.UnitPrice * salesCreateDto.Quantity;

            if (product.Quantity == 0)
            { product.Available = false; }

            var sales = new Sales
            {
                Price = salesCreateDto.Price,
                Quantity = salesCreateDto.Quantity,
                Product = product,
                Client = client,
                Employee = employee
            };

            _context.Sales.Add(sales);
            await _context.SaveChangesAsync();

            var createdDto = new SalesDto
            {
                Id = sales.Id,
                Price = sales.Price,
                Quantity = sales.Quantity,
                Product = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name
                },
                Client = new ClientDto
                {
                    Id = client.Id,
                    Name = client.Name,
                    NIF = client.NIF
                },
                Employee = new PutEmployeeDto
                {
                    Id = employee.Id,
                    Name = employee.Name,
                    Email = employee.Name
                }
            };

            return CreatedAtAction(nameof(GetSalesById), new { id = sales.Id }, createdDto);
        }

        // PUT: api/sales/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<SalesDto>> UpdateSales(Guid id, SalesDto salesUpdateDto)
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

            var product = await _context.Products.FindAsync(salesUpdateDto.Product.Id);
            var client = await _context.Clients.FindAsync(salesUpdateDto.Client.Id);
            var employee = await _context.Employees.FindAsync(salesUpdateDto.Employee.Id);

            if (product == null || client == null || employee == null)
            {
                return BadRequest("Invalid Product, Client, or Employee ID");
            }

            if (salesUpdateDto.Quantity <= 0)
            {
                return BadRequest("Invalid Quantity");
            }

            if (salesUpdateDto.Quantity > sales.Quantity)
            {
                var quantityDifference = salesUpdateDto.Quantity - sales.Quantity;

                if (quantityDifference > product.Quantity)
                {
                    return BadRequest("Insufficient quantity of the product");
                }

                product.Quantity -= quantityDifference;
                salesUpdateDto.Price = product.UnitPrice * salesUpdateDto.Quantity;
            }

            if (product.Quantity == 0)
            {
                product.Available = false;
            }

            sales.Price = salesUpdateDto.Price;
            sales.Quantity = salesUpdateDto.Quantity;
            sales.Product = product;
            sales.Client = client;
            sales.Employee = employee;

            await _context.SaveChangesAsync();

            var updatedDto = new SalesDto
            {
                Id = sales.Id,
                Price = sales.Price,
                Quantity = sales.Quantity,
                Product = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name
                },
                Client = new ClientDto
                {
                    Id = client.Id,
                    Name = client.Name,
                    NIF = client.NIF
                },
                Employee = new PutEmployeeDto
                {
                    Id = employee.Id,
                    Name = employee.Name,
                    Email = employee.Name
                }
            };

            return Ok(updatedDto);
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