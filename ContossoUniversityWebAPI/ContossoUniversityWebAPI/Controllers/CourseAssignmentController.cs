using contoso.Dtos.CourseAssignment;
using ContosoUniversity.Models;
using ContossoUniversityWebAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace contoso.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseAssignmentController : ControllerBase
    {
        private readonly IRepository<CourseAssignment> _courseAssignmentRepo;

        public CourseAssignmentController(IRepository<CourseAssignment> courseAssignmentRepo)
        {
            _courseAssignmentRepo = courseAssignmentRepo;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<CourseAssignmentDTO>>> GetAllCourseAssignments()
        {
            var courseAssignments = await _courseAssignmentRepo.GetAllAsync();

            // Map to DTOs
            var courseAssignmentDTOs = courseAssignments.Select(ca => new CourseAssignmentDTO
            {
                //check here
                CourseAssignmentId = ca.CourseID,
                CourseID = ca.CourseID,
                InstructorID = ca.InstructorID

            }).ToList();

            return Ok(courseAssignmentDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CourseAssignmentDTO>> GetCourseAssignmentById(int id)
        {
            var courseAssignment = await _courseAssignmentRepo.GetByIdAsync(id);

            if (courseAssignment == null)
            {
                return NotFound();
            }

            // Map to DTO
            var courseAssignmentDTO = new CourseAssignmentDTO
            {
                //check here
                CourseAssignmentId = courseAssignment.CourseID,
                CourseID = courseAssignment.CourseID,
                InstructorID = courseAssignment.InstructorID
            };

            return Ok(courseAssignmentDTO);
        }

        [HttpPost]
        public async Task<ActionResult<CourseAssignmentDTO>> AddNewCourseAssignment(CourseAssignmentDTO courseAssignmentDto)
        {
            var courseAssignment = new CourseAssignment
            {
                CourseID = courseAssignmentDto.CourseID,
                InstructorID = courseAssignmentDto.InstructorID
            };

            var newCourseAssignment = await _courseAssignmentRepo.AddAsync(courseAssignment);

            var newCourseAssignmentDTO = new CourseAssignmentDTO
            {
                //check here
                CourseAssignmentId = newCourseAssignment.CourseID,
                CourseID = newCourseAssignment.CourseID,
                InstructorID = newCourseAssignment.InstructorID
            };

            return CreatedAtAction(nameof(GetCourseAssignmentById), new { id = newCourseAssignmentDTO.CourseAssignmentId }, newCourseAssignmentDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourseAssignment(int id, CourseAssignmentUpdateDTO courseAssignmentDto)
        {


            // Check if the course assignment exists before attempting an update
            var existingCourseAssignment = await _courseAssignmentRepo.GetByIdAsync(id);
            if (existingCourseAssignment == null)
            {
                return NotFound("Course assignment not found.");
            }

            try
            {
                var courseAssignment = new CourseAssignment
                {
                    //CourseAssignmentId = id,
                    CourseID = courseAssignmentDto.CourseID,
                    InstructorID = courseAssignmentDto.InstructorID
                };

                await _courseAssignmentRepo.UpdateAsync(courseAssignment);
            }
            catch (DbUpdateConcurrencyException)
            {
                // Handle the concurrency issue by returning a conflict response
                return Conflict("The course assignment record you attempted to update was modified by another user after you got the original value.");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourseAssignmentById(int id)
        {
            var courseAssignment = await _courseAssignmentRepo.DeleteAsync(id);

            if (courseAssignment == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
