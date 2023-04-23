using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
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
            return await _context.Clients.ToListAsync();
        }

        // GET: api/Clients/'uuid'
        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(Guid id)
        {
            return await _context.Clients.FindAsync(id);
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
        public async Task<ActionResult<ClientDto>> Register(RegisterDto registerDto)
        {
            if (await ClientExists(registerDto.Email)) return BadRequest("Email is taken");

            using var hmac = new HMACSHA512();

            var client = new Client
            {
                Name = registerDto.Name,
                Email = registerDto.Email.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            return new ClientDto
            {
                Name = client.Name,
                Email = client.Email,
                Token = _tokenService.CreateToken(client)
            };
        }


        // LOGIN
        [HttpPost("login")]
        public async Task<ActionResult<ClientDto>> Login(LoginDto loginDto)
        {
            var client = await _context.Clients.SingleOrDefaultAsync(x => x.Email == loginDto.Email);

            if (client == null) return Unauthorized("Invalid Email");

            using var hmac = new HMACSHA512(client.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != client.PasswordHash[i]) return Unauthorized("Invalid Password");
            }

            var clientDto = new ClientDto
            {
                Email = client.Email,
                Token = _tokenService.CreateToken(client)
            };

            return clientDto;
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

    }
}