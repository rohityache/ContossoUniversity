using contoso.Dtos.Course;
using ContosoUniversity.Models;
using ContossoUniversityWebAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace contoso.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly IRepository<Course> _courseRepo;

        public CourseController(IRepository<Course> courseRepo)
        {
            _courseRepo = courseRepo;
        }


        //[Authorize(Roles = "Student")]
        [HttpGet]
        public async Task<ActionResult<ICollection<CourseDTO>>> GetAllCourses()
        {

            var courses = await _courseRepo.GetAllAsync();

            // Map to DTOs
            var courseDTOs = courses.Select(c => new CourseDTO
            {
                CourseID = c.CourseID,
                Title = c.Title,
                Credits = c.Credits,
                DepartmentID = c.DepartmentID
            }).ToList();

            return Ok(courseDTOs);
        }

        [HttpGet("department/{deptId}")]
        public async Task<ActionResult<CourseDTO>> GetCoursesByDepartment(int deptId)
        {
            var courses = await _courseRepo.GetAllAsync();

            // Map to DTOs
            var courseDTOs = courses.Select(c => new CourseDTO
            {
                CourseID = c.CourseID,
                Title = c.Title,
                Credits = c.Credits,
                DepartmentID = c.DepartmentID
            }).Where(c => c.DepartmentID == deptId).ToList();

            return Ok(courseDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CourseDTO>> GetCourseById(int id)
        {
            var course = await _courseRepo.GetByIdAsync(id);

            if (course == null)
            {
                return NotFound();
            }

            // Map to DTO
            var courseDTO = new CourseDTO
            {
                CourseID = course.CourseID,
                Title = course.Title,
                Credits = course.Credits,
                DepartmentID = course.DepartmentID
            };

            return Ok(courseDTO);
        }

        //[Authorize(Roles = "Instructor")]
        [HttpPost]
        public async Task<ActionResult<CourseDTO>> AddNewCourse(CourseDTO courseDto)
        {
            var course = new Course
            {
                CourseID = courseDto.CourseID,
                Title = courseDto.Title,
                Credits = courseDto.Credits,
                DepartmentID = courseDto.DepartmentID
            };

            var newCourse = await _courseRepo.AddAsync(course);

            var newCourseDTO = new CourseDTO
            {
                CourseID = newCourse.CourseID,
                Title = newCourse.Title,
                Credits = newCourse.Credits,
                DepartmentID = newCourse.DepartmentID
            };

            return CreatedAtAction(nameof(GetCourseById), new { id = newCourseDTO.CourseID }, newCourseDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, CourseUpdateDTO courseDto)
        {


            // Check if the course exists before attempting an update
            var existingCourse = await _courseRepo.GetByIdAsync(id);
            if (existingCourse == null)
            {
                return NotFound("Course not found.");
            }

            try
            {
                var course = new Course
                {
                    CourseID = id,
                    Title = courseDto.Title,
                    Credits = courseDto.Credits,
                    DepartmentID = courseDto.DepartmentID
                };

                await _courseRepo.UpdateAsync(course);
            }
            catch (DbUpdateConcurrencyException)
            {
                // Handle the concurrency issue by returning a conflict response
                return Conflict("The course record you attempted to update was modified by another user after you got the original value.");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourseById(int id)
        {
            var course = await _courseRepo.DeleteAsync(id);

            if (course == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
