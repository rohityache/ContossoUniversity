using contoso.Dtos.Student;
using ContosoUniversity.Data;
using ContosoUniversity.Models;
using ContossoUniversityWebAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace contoso.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        public readonly IRepository<Student> _studentRepo;
        public readonly ContosoContext _context;

        public StudentController(IRepository<Student> studentRepo, ContosoContext contosoContext)
        {
            _studentRepo = studentRepo;
            _context = contosoContext;
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<ICollection<StudentDTO>>> GetAllStudents()
        {
            var students = await _studentRepo.GetAllAsync();

            // Map to DTOs
            var studentDTOs = students.Select(s => new StudentDTO
            {
                Id = s.ID,
                LastName = s.LastName,
                FirstMidName = s.FirstMidName,
                EnrollmentDate = s.EnrollmentDate
            }).ToList();

            return Ok(studentDTOs);
        }

        //[Authorize(Roles = "Student")]
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentDTO>> GetStudentById(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentException("ID must be a positive non-zero value", nameof(id));
            }
            var student = await _studentRepo.GetByIdAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            // Map to DTO
            var studentDTO = new StudentDTO
            {
                Id = student.ID,
                LastName = student.LastName,
                FirstMidName = student.FirstMidName,
                EnrollmentDate = student.EnrollmentDate
            };


            return Ok(studentDTO);
        }

        [HttpPost]
        public async Task<ActionResult<StudentDTO>> AddNewStudent(StudentDTO studentDto)
        {
            var student = new Student
            {
                LastName = studentDto.LastName,
                FirstMidName = studentDto.FirstMidName,
                EnrollmentDate = studentDto.EnrollmentDate
            };

            var newStudent = await _studentRepo.AddAsync(student);

            var newStudentDTO = new StudentDTO
            {
                Id = newStudent.ID,
                LastName = newStudent.LastName,
                FirstMidName = newStudent.FirstMidName,
                EnrollmentDate = newStudent.EnrollmentDate
            };
            //Tracking changes in the entity and log it 
            var entryState = _context.Entry(student).State;
            Console.WriteLine("The state is changes !! " + entryState);


            return CreatedAtAction(nameof(GetStudentById), new { id = newStudentDTO.Id }, newStudentDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, StudentDTO studentUpdateDto)
        {

            var student = new Student
            {
                ID = id,
                LastName = studentUpdateDto.LastName,
                FirstMidName = studentUpdateDto.FirstMidName,
                EnrollmentDate = studentUpdateDto.EnrollmentDate
            };

            await _studentRepo.UpdateAsync(student);
            // Tracking changes in the entity and logging it
            var entry = _context.Entry(student);
            Console.WriteLine("The state has changed: " + entry.State);


            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudentById(int id)
        {
            var student = await _studentRepo.DeleteAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            // Tracking changes in the entity and logging it
            var entry = _context.Entry(student);
            Console.WriteLine("The state has changed: " + entry.State);

            return NoContent();
        }
    }
}
