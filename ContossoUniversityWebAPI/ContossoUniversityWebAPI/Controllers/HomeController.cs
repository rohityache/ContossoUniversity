using ContosoUniversity.Data;
using ContosoUniversity.Models;
using ContosoUniversity.Models.SchoolViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace ContosoUniversity.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ContosoContext _context;

        public HomeController(ContosoContext context, ILogger<HomeController> logger)
        {
            _logger = logger;
            _context = context;
        }

        // GET: api/Home
        [HttpGet]
        public IActionResult Index()
        {
            return Ok("Welcome to the Contoso University API");
        }

        // GET: api/Home/About
        [HttpGet("About")]
        public async Task<ActionResult<IEnumerable<EnrollmentDateGroup>>> About()
        {
            var data = from student in _context.Students
                       group student by student.EnrollmentDate into dateGroup
                       select new EnrollmentDateGroup()
                       {
                           EnrollmentDate = dateGroup.Key,
                           StudentCount = dateGroup.Count()
                       };

            return Ok(await data.AsNoTracking().ToListAsync());
        }

        // GET: api/Home/Privacy
        [HttpGet("Privacy")]
        public IActionResult Privacy()
        {
            return Ok("Privacy policy information goes here.");
        }

        // GET: api/Home/Error
        [HttpGet("Error")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            var error = new ErrorViewModel
            {
                RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
            };
            return StatusCode(500, error);
        }
    }
}
