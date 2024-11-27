using ContossoUniversityWebAPI.DTOs;
using ContossoUniversityWebAPI.HelperClass;
using ContossoUniversityWebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ContossoUniversityWebAPI.Controllers
{
    //Account Controller to manage the login and register requests
    
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {   
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly JwtTokenHelper _jwtTokenHelper;

        public AccountController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<ApplicationUser> signInManager, JwtTokenHelper jwtTokenHelper)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _jwtTokenHelper = jwtTokenHelper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto model)
        {
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };

            // Create the user
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Ensure the role exists
                if (!await _roleManager.RoleExistsAsync(model.Role))
                {
                    // Create the role if it does not exist
                   
                        return BadRequest("Role does not exist try with different role.");
                    
                }

                // Assign the role to the user
                await _userManager.AddToRoleAsync(user, model.Role);

                return Ok("User registered successfully!");
            }

            return BadRequest(result.Errors);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized("Invalid login attempt.");
            }

            var signInResult = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, false, lockoutOnFailure: true);

            if (signInResult.Succeeded)
            {
                // Generate token if user is authenticated
                var token = await _jwtTokenHelper.GenerateToken(user);
                return Ok(new { Token = token });
            }
            else if (signInResult.IsLockedOut)
            {
                // User is locked out due to too many failed attempts
                return StatusCode(StatusCodes.Status403Forbidden, "Account is locked. Please try again later.");
            }
            else
            {
                // Failed login attempt
                return Unauthorized("Invalid login attempt.");
            }
        }
    }


}
