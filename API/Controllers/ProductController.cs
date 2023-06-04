using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    //[Authorize]
    public class ProductController : BaseApiController
    {       
        private readonly DataContext _context;

        public ProductController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.Include(p => p.Supplier).ToListAsync();
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(Guid id)
        {
            var product = await _context.Products.Include(p => p.Supplier).FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            { return NotFound(); }

            return product;
        }

        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            var sup = await _context.Suppliers.FindAsync(product.Supplier.Id);

            if (sup == null)
            { return BadRequest("Invalid Supplier's Id"); }

            if(product.Quantity > 0)
            {product.Available = true;}
            else
            {product.Available = false;}

            product.Supplier = sup;
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(Guid id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            var existingProduct = await _context.Products
                .Include(p => p.Supplier)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (existingProduct == null)
            {
                return NotFound();
            }

            existingProduct.Name = product.Name;
            existingProduct.UnitPrice = product.UnitPrice;
            existingProduct.Quantity = product.Quantity;

            if (product.Supplier != null && product.Supplier.Id != null)
            {
                var existingSupplier = await _context.Suppliers.FindAsync(product.Supplier.Id);
                if (existingSupplier != null)
                {
                    existingProduct.Supplier = existingSupplier;
                }
            }

            if(product.Quantity > 0 || existingProduct.Quantity > 0)
            {product.Available=true; existingProduct.Available = true;}
            else{product.Available=false; existingProduct.Available = false;}

            await _context.SaveChangesAsync();

            return NoContent();
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(Guid id)
        {
            return _context.Products.Any(p => p.Id == id);
        }
    }
}