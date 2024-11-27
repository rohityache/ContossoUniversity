using contoso.Dtos.Enrollment;
using ContosoUniversity.Models;
using ContossoUniversityWebAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace contoso.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentController : ControllerBase
    {
        private readonly IRepository<Enrollment> _enrollmentRepo;

        public EnrollmentController(IRepository<Enrollment> enrollmentRepo)
        {
            _enrollmentRepo = enrollmentRepo;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<EnrollmentDTO>>> GetAllEnrollments()
        {
            var enrollments = await _enrollmentRepo.GetAllAsync();

            // Map to DTOs
            var enrollmentDTOs = enrollments.Select(e => new EnrollmentDTO
            {
                EnrollmentID = e.EnrollmentID,
                CourseID = e.CourseID,
                StudentID = e.StudentID,
                Grade = e.Grade
            }).ToList();

            return Ok(enrollmentDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EnrollmentDTO>> GetEnrollmentById(int id)
        {
            var enrollment = await _enrollmentRepo.GetByIdAsync(id);

            if (enrollment == null)
            {
                return NotFound();
            }

            // Map to DTO
            var enrollmentDTO = new EnrollmentDTO
            {
                EnrollmentID = enrollment.EnrollmentID,
                CourseID = enrollment.CourseID,
                StudentID = enrollment.StudentID,
                Grade = enrollment.Grade
            };

            return Ok(enrollmentDTO);
        }

        [HttpPost]
        public async Task<ActionResult<EnrollmentDTO>> AddNewEnrollment(EnrollmentDTO enrollmentDto)
        {
            var enrollment = new Enrollment
            {
                CourseID = enrollmentDto.CourseID,
                StudentID = enrollmentDto.StudentID,
                Grade = enrollmentDto.Grade
            };

            var newEnrollment = await _enrollmentRepo.AddAsync(enrollment);

            var newEnrollmentDTO = new EnrollmentDTO
            {
                EnrollmentID = newEnrollment.EnrollmentID,
                CourseID = newEnrollment.CourseID,
                StudentID = newEnrollment.StudentID,
                Grade = newEnrollment.Grade
            };

            return CreatedAtAction(nameof(GetEnrollmentById), new { id = newEnrollmentDTO.EnrollmentID }, newEnrollmentDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEnrollment(int id, EnrollmentDTO enrollmentDto)
        {
            if (id != enrollmentDto.EnrollmentID)
            {
                return BadRequest();
            }

            // Check if the enrollment exists before attempting an update
            var existingEnrollment = await _enrollmentRepo.GetByIdAsync(id);
            if (existingEnrollment == null)
            {
                return NotFound("Enrollment not found.");
            }

            try
            {
                var enrollment = new Enrollment
                {
                    EnrollmentID = enrollmentDto.EnrollmentID,
                    CourseID = enrollmentDto.CourseID,
                    StudentID = enrollmentDto.StudentID,
                    Grade = enrollmentDto.Grade
                };

                await _enrollmentRepo.UpdateAsync(enrollment);
            }
            catch (DbUpdateConcurrencyException)
            {
                // Handle the concurrency issue by returning a conflict response
                return Conflict("The enrollment record you attempted to update was modified by another user after you got the original value.");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEnrollmentById(int id)
        {
            var enrollment = await _enrollmentRepo.DeleteAsync(id);

            if (enrollment == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
