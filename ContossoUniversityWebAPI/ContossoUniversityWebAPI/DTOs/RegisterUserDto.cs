using System.ComponentModel.DataAnnotations;

namespace ContossoUniversityWebAPI.DTOs
{
    public class RegisterUserDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [MinLength(8)]
        public string Password { get; set; }

        public string Role { get; set; }
    }

}
