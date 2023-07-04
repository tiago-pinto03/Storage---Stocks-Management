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
    public class EmployeeController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;

        public EmployeeController(DataContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        // GET: api/Employee
        [Authorize] 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            var emp = await _context.Employees.OrderBy(o => o.Name).Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.Phone,
                u.IsAdmin
            }).ToListAsync();

            return Ok(emp);
        }

        // GET: api/Employee/'uuid'
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<PutEmployeeDto>> GetEmployeeById(Guid id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            var employeeDto = new PutEmployeeDto
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Phone = employee.Phone,
                IsAdmin = employee.IsAdmin,
            };

            return Ok(employeeDto);
        }

        // PUT: api/Employee/'uuid'
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<IEnumerable<PutEmployeeDto>>> PutUser(Guid id, PutEmployeeDto putEmployeeDto)
        {
            var emp = await _context.Employees.SingleOrDefaultAsync(x => x.Id == putEmployeeDto.Id);

            if (emp == null) return Unauthorized("Invalid Id");

            emp.Name = putEmployeeDto.Name;
            emp.Email = putEmployeeDto.Email;
            emp.Phone = putEmployeeDto.Phone;

            await _context.SaveChangesAsync();

            return NoContent();
        }



        // Register: api/Employee/register
        //[Authorize]
        [HttpPost("register")]
        public async Task<ActionResult<EmployeeDto>> Register(RegisterDto registerDto)
        {
            if (await EmployeeExists(registerDto.Email)) return BadRequest("Email is taken");

            using var hmac = new HMACSHA512();

            var employee = new Employee
            {
                Name = registerDto.Name,
                Email = registerDto.Email.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return new EmployeeDto
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Token = _tokenService.CreateTokenEmp(employee)
            };
        }


        // LOGIN
        [HttpPost("login")]
        public async Task<ActionResult<EmployeeDto>> Login(LoginDto loginDto)
        {
            var employee = await _context.Employees.SingleOrDefaultAsync(x => x.Email == loginDto.Email);

            if (employee == null) return Unauthorized("Invalid Email");

            using var hmac = new HMACSHA512(employee.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != employee.PasswordHash[i]) return Unauthorized("Invalid Password");
            }

            var employeeDto = new EmployeeDto
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Token = _tokenService.CreateTokenEmp(employee),
                IsAdmin = employee.IsAdmin
            };

            return employeeDto;
        }


        // DELETE: api/Employee/'uuid'
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(Guid id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> EmployeeExists(string email)
        {
            return await _context.Employees.AnyAsync(x => x.Email == email.ToLower());
        }
    }
}