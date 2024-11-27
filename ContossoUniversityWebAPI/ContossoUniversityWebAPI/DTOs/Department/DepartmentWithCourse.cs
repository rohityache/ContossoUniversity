using contoso.Dtos.Course;

namespace contoso.Dtos.Department
{
    public class DepartmentWithCourseDTO
    {
        public int DepartmentID { get; set; }
        public string Name { get; set; }
        public decimal Budget { get; set; }
        public DateTime StartDate { get; set; }
        public int? InstructorID { get; set; }
        public List<CourseDTO> Courses { get; set; }
    }
}
