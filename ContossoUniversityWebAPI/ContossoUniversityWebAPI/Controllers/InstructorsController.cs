using contoso.Dtos.Instrcutor;
using ContosoUniversity.Models;
using ContossoUniversityWebAPI.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace contoso.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorController : Controller
    {
        private readonly IRepository<Instructor> _instructorRepo;

        public InstructorController(IRepository<Instructor> instructorRepo)
        {
            _instructorRepo = instructorRepo;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<InstructorDTO>>> GetAllInstructors()
        {
            var instructors = await _instructorRepo.GetAllAsync();

            // Map to DTOs
            var instructorDTOs = instructors.Select(i => new InstructorDTO
            {
                Id = i.ID,
                LastName = i.LastName,
                FirstMidName = i.FirstMidName,
                HireDate = i.HireDate
            }).ToList();

            return Ok(instructorDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InstructorDTO>> GetInstructorById(int id)
        {
            var instructor = await _instructorRepo.GetByIdAsync(id);

            if (instructor == null)
            {
                return NotFound();
            }

            // Map to DTO
            var instructorDTO = new InstructorDTO
            {
                Id = instructor.ID,
                LastName = instructor.LastName,
                FirstMidName = instructor.FirstMidName,
                HireDate = instructor.HireDate
            };

            return Ok(instructorDTO);
        }

        [HttpPost]
        public async Task<ActionResult<InstructorDTO>> AddNewInstructor(InstructorDTO instructorDto)
        {
            var instructor = new Instructor
            {
                LastName = instructorDto.LastName,
                FirstMidName = instructorDto.FirstMidName,
                HireDate = instructorDto.HireDate
            };

            var newInstructor = await _instructorRepo.AddAsync(instructor);

            var newInstructorDTO = new InstructorDTO
            {
                Id = newInstructor.ID,
                LastName = newInstructor.LastName,
                FirstMidName = newInstructor.FirstMidName,
                HireDate = newInstructor.HireDate
            };

            return CreatedAtAction(nameof(GetInstructorById), new { id = newInstructorDTO.Id }, newInstructorDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInstructor(int id, InstructorUpdateDTO instructorDto)
        {
            // Check if the instructor exists before attempting an update
            var existingInstructor = await _instructorRepo.GetByIdAsync(id);

            if (existingInstructor == null)
            {
                return NotFound("Instructor not found.");
            }

            try
            {
                // Update the properties of the existing instructor
                existingInstructor.LastName = instructorDto.LastName;
                existingInstructor.FirstMidName = instructorDto.FirstMidName;
                existingInstructor.HireDate = instructorDto.HireDate;


                await _instructorRepo.UpdateAsync(existingInstructor);
            }
            catch (DbUpdateConcurrencyException)
            {
                // Handle the concurrency issue by returning a conflict response
                return Conflict("The instructor record you attempted to update was modified by another user after you got the original value.");
            }

            var result = existingInstructor.LastName + " " + existingInstructor.FirstMidName + " " + existingInstructor.HireDate;
            return Ok("Updated Successfully!  "+ result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInstructorById(int id)
        {
            var instructor = await _instructorRepo.DeleteAsync(id);

            if (instructor == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
