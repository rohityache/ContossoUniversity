namespace contoso.Dtos.Department
{
    public class DepartmentUpdateDTO
    {
        public string Name { get; set; }
        public decimal Budget { get; set; }
        public DateTime StartDate { get; set; }
        public int? InstructorID { get; set; }
    }
}
