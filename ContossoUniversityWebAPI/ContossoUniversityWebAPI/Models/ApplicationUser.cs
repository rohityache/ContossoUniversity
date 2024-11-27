using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ContossoUniversityWebAPI.Models
{
    public class ApplicationUser: IdentityUser
    {
        [Required]
        [RegularExpression("^[a-zA-Z]{3,50}$", ErrorMessage = "First name must contain only characters and have a length between 3 and 50.")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [RegularExpression("^[a-zA-Z]{1,50}$", ErrorMessage = "Last name must contain only characters and have a length between 1 and 50.")]
        public string LastName { get; set; } = string.Empty;

        public string Role;
    }
}
