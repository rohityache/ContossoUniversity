using contoso.Dtos.OfficeAssignment;
using ContosoUniversity.Models;
using ContossoUniversityWebAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace contoso.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfficeAssignmentController : ControllerBase
    {
        private readonly IRepository<OfficeAssignment> _officeAssignmentRepo;

        public OfficeAssignmentController(IRepository<OfficeAssignment> officeAssignmentRepo)
        {
            _officeAssignmentRepo = officeAssignmentRepo;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<OfficeAssignmentDTO>>> GetAllOfficeAssignments()
        {
            var officeAssignments = await _officeAssignmentRepo.GetAllAsync();

            // Map to DTOs
            var officeAssignmentDTOs = officeAssignments.Select(oa => new OfficeAssignmentDTO
            {
                InstructorID = oa.InstructorID,
                Location = oa.Location
            }).ToList();

            return Ok(officeAssignmentDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OfficeAssignmentDTO>> GetOfficeAssignmentById(int id)
        {
            var officeAssignment = await _officeAssignmentRepo.GetByIdAsync(id);

            if (officeAssignment == null)
            {
                return NotFound();
            }

            // Map to DTO
            var officeAssignmentDTO = new OfficeAssignmentDTO
            {
                InstructorID = officeAssignment.InstructorID,
                Location = officeAssignment.Location
            };

            return Ok(officeAssignmentDTO);
        }

        [HttpPost]
        public async Task<ActionResult<OfficeAssignmentDTO>> AddNewOfficeAssignment(OfficeAssignmentDTO officeAssignmentDto)
        {
            var officeAssignment = new OfficeAssignment
            {
                InstructorID = officeAssignmentDto.InstructorID,
                Location = officeAssignmentDto.Location
            };

            var newOfficeAssignment = await _officeAssignmentRepo.AddAsync(officeAssignment);

            var newOfficeAssignmentDTO = new OfficeAssignmentDTO
            {
                InstructorID = newOfficeAssignment.InstructorID,
                Location = newOfficeAssignment.Location
            };

            return CreatedAtAction(nameof(GetOfficeAssignmentById), new { id = newOfficeAssignmentDTO.InstructorID }, newOfficeAssignmentDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOfficeAssignment(int id, OfficeAssignmentUpdateDTO officeAssignmentDto)
        {

            // Check if the office assignment exists before attempting an update
            var existingOfficeAssignment = await _officeAssignmentRepo.GetByIdAsync(id);
            if (existingOfficeAssignment == null)
            {
                return NotFound("Office assignment not found.");
            }

            try
            {
                var officeAssignment = new OfficeAssignment
                {
                    InstructorID = id,
                    Location = officeAssignmentDto.Location
                };

                await _officeAssignmentRepo.UpdateAsync(officeAssignment);
            }
            catch (DbUpdateConcurrencyException)
            {
                // Handle the concurrency issue by returning a conflict response
                return Conflict("The office assignment record you attempted to update was modified by another user after you got the original value.");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOfficeAssignmentById(int id)
        {
            var officeAssignment = await _officeAssignmentRepo.DeleteAsync(id);

            if (officeAssignment == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
