using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class ClientController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;

        public ClientController(DataContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        // GET: api/Clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            var client = await _context.Clients.Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.NIF,
                u.Phone
            }).ToListAsync();

            return Ok(client);
        }

        // GET: api/Clients/'uuid'
        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(Guid id)
        {
            var client = await _context.Clients.Where(u => u.Id == id).Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.NIF,
                u.Phone
            }).ToListAsync();

            if (client == null)
            {
                return NotFound();
            }
            if (client.Count <= 0)
            { return BadRequest("ClientId not found!"); }

            return Ok(client);
        }

        // PUT: api/Clients/'uuid'
        [HttpPut("{id}")]
        public async Task<ActionResult<IEnumerable<PutClientDto>>> PutUser(Guid id, PutClientDto putClientDto)
        {
            var cli = await _context.Clients.SingleOrDefaultAsync(x => x.Id == putClientDto.Id);

            if (cli == null) return Unauthorized("Invalid Id");

            cli.Name = putClientDto.Name;
            cli.Email = putClientDto.Email;
            cli.NIF = putClientDto.NIF;
            cli.Phone = putClientDto.Phone;

            await _context.SaveChangesAsync();

            return NoContent();
        }



        // Register: api/clients/register
        [HttpPost("register")]
        public async Task<ActionResult<ClientDto>> Register(RegisterClientDto registerClientDto)
        {
            if (await ClientExists(registerClientDto.Email)) return BadRequest("Email is taken");
            if (await ClientNifExists(registerClientDto.NIF)) return BadRequest("NIF is taken");
            if (registerClientDto.NIF <= 99999999) { return BadRequest("Invalid NIF provided."); }

            using var hmac = new HMACSHA512();

            var client = new Client
            {
                Name = registerClientDto.Name,
                Email = registerClientDto.Email.ToLower(),
                NIF = registerClientDto.NIF,
                Phone = registerClientDto.Phone
            };

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            return new ClientDto
            {
                Id = client.Id,
                Name = client.Name,
                Email = client.Email,
                NIF = client.NIF
            };
        }


        // DELETE: api/Clients/'uuid'
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(Guid id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> ClientExists(string email)
        {
            return await _context.Clients.AnyAsync(x => x.Email == email.ToLower());
        }

        private async Task<bool> ClientNifExists(int nif)
        {
            return await _context.Clients.AnyAsync(x => x.NIF == nif);
        }

    }
}