using contoso.Dtos.Course;
using contoso.Dtos.Department;
using ContosoUniversity.Models;
using ContossoUniversityWebAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace contoso.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IRepository<Department> _departmentRepo;

        public DepartmentController(IRepository<Department> departmentRepo)
        {
            _departmentRepo = departmentRepo;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<DepartmentDTO>>> GetAllDepartments()
        {
            var departments = await _departmentRepo.GetAllAsync();

            // Map to DTOs
            var departmentDTOs = departments.Select(d => new DepartmentDTO
            {
                DepartmentID = d.DepartmentID,
                Name = d.Name,
                Budget = d.Budget,
                StartDate = d.StartDate,
                InstructorID = d.InstructorID
            }).ToList();

            return Ok(departmentDTOs);
        }

        [HttpGet("getDepartmentsWithCourses")]
        public async Task<ActionResult<ICollection<DepartmentWithCourseDTO>>> GetDepartmentsWithCourses()
        {
            var departments = await _departmentRepo.GetAllAsync();

            var departmentWithCourse = departments.Select(d => new DepartmentWithCourseDTO
            {
                DepartmentID = d.DepartmentID,
                Name = d.Name,
                Budget = d.Budget,
                StartDate = d.StartDate,
                InstructorID = d.InstructorID,
                Courses = d.Courses.Select(c => new CourseDTO
                {
                    CourseID = c.CourseID,
                    Title = c.Title,
                    Credits = c.Credits
                }).ToList()
            }).ToList();

            return Ok(departmentWithCourse);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentDTO>> GetDepartmentById(int id)
        {
            var department = await _departmentRepo.GetByIdAsync(id);

            if (department == null)
            {
                return NotFound();
            }

            // Map to DTO
            var departmentDTO = new DepartmentDTO
            {
                DepartmentID = department.DepartmentID,
                Name = department.Name,
                Budget = department.Budget,
                StartDate = department.StartDate,
                InstructorID = department.InstructorID
            };

            return Ok(departmentDTO);
        }

        [HttpPost]
        public async Task<ActionResult<DepartmentDTO>> AddNewDepartment(DepartmentDTO departmentDto)
        {
            var department = new Department
            {
                Name = departmentDto.Name,
                Budget = departmentDto.Budget,
                StartDate = departmentDto.StartDate,
                InstructorID = departmentDto.InstructorID
            };

            var newDepartment = await _departmentRepo.AddAsync(department);

            var newDepartmentDTO = new DepartmentDTO
            {
                DepartmentID = newDepartment.DepartmentID,
                Name = newDepartment.Name,
                Budget = newDepartment.Budget,
                StartDate = newDepartment.StartDate,
                InstructorID = newDepartment.InstructorID
            };

            return CreatedAtAction(nameof(GetDepartmentById), new { id = newDepartmentDTO.DepartmentID }, newDepartmentDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, DepartmentUpdateDTO departmentDto)
        {
            // Check if the department exists before attempting an update
            var existingDepartment = await _departmentRepo.GetByIdAsync(id);
            if (existingDepartment == null)
            {
                return NotFound("Department not found.");
            }

            try
            {
                var department = new Department
                {
                    DepartmentID = id,
                    Name = departmentDto.Name,
                    Budget = departmentDto.Budget,
                    StartDate = departmentDto.StartDate,
                    InstructorID = departmentDto.InstructorID
                };

                await _departmentRepo.UpdateAsync(department);
            }
            catch (DbUpdateConcurrencyException)
            {
                // Handle the concurrency issue by returning a conflict response
                return Conflict("The department record you attempted to update was modified by another user after you got the original value.");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartmentById(int id)
        {
            var department = await _departmentRepo.DeleteAsync(id);

            if (department == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
