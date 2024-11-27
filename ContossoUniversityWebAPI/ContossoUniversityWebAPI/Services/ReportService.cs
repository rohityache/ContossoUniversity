using ContosoUniversity.Data;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;

namespace ContosoUniversity.Services
{
    public class ReportService
    {
        private readonly ContosoContext _context;

        public ReportService(ContosoContext context)
        {
            _context = context;
        }

        //public byte[] GenerateInstructorByDepartmentReport(string departmentName)
        //{
        //    var departmentId = _context.Departments.Where(d=>d.Name == departmentName).FirstOrDefault();

        //    var instructors = _context.Instructors.Where(i=>i.)

        //}
        //

            

        public byte[] GenerateStudentsByCourseReport(string courseName)
        {
            var StudentsByCourses = _context.Enrollments.
                Include(e => e.Student).
                Include(e => e.Course).
                Where(e => e.Course.Title == courseName).Select(e => e.Student).ToList();

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Store Report");
                worksheet.Cells[1, 1].Value = "First Name";
                worksheet.Cells[1, 2].Value = "Last Name";
                worksheet.Cells[1, 3].Value = "Full Name";
                worksheet.Cells[1, 4].Value = "Enrollment Date";

                for (int i = 0; i < StudentsByCourses.Count; i++)
                {
                    worksheet.Cells[i + 2, 1].Value = StudentsByCourses[i].LastName;
                    worksheet.Cells[i + 2, 2].Value = StudentsByCourses[i].FirstMidName;
                    worksheet.Cells[i + 2, 3].Value = StudentsByCourses[i].FullName;
                    worksheet.Cells[i + 2, 4].Value = StudentsByCourses[i].EnrollmentDate;
                }

                return package.GetAsByteArray();


            }
        }

        public byte[] GenerateInstructorsWithCourseReport()
        {
            var instructorsWithCourse = _context.CourseAssignments
                                                .Include(c => c.Course)
                                                .Include(c => c.Instructor)
                                                .Select(c => new
                                                {
                                                    CourseTitle = c.Course.Title,
                                                    InstructorName = c.Instructor.FullName
                                                })
                                                .ToList();

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Instructors with Courses Report");
                worksheet.Cells[1, 1].Value = "Course Name";
                worksheet.Cells[1, 2].Value = "Instructor Name";

                for (int i = 0; i < instructorsWithCourse.Count; i++)
                {
                    worksheet.Cells[i + 2, 1].Value = instructorsWithCourse[i].CourseTitle;
                    worksheet.Cells[i + 2, 2].Value = instructorsWithCourse[i].InstructorName;
                }

                return package.GetAsByteArray();
            }
        }
        public byte[] GenerateInstructorByDepartmentReport(string departmentName)
        {
            var InstuctorId = _context.Departments.Where(d => d.Name == departmentName).Select(d => d.InstructorID).FirstOrDefault();

            var instructors = _context.Instructors
                .Where(i => i.ID == InstuctorId)
                .ToList();

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Instructors by Department Report");
                worksheet.Cells[1, 1].Value = "First Name";
                worksheet.Cells[1, 2].Value = "Last Name";
                worksheet.Cells[1, 3].Value = "Full Name";
                worksheet.Cells[1, 4].Value = "Hire Date";

                for (int i = 0; i < instructors.Count; i++)
                {
                    worksheet.Cells[i + 2, 1].Value = instructors[i].FirstMidName;
                    worksheet.Cells[i + 2, 2].Value = instructors[i].LastName;
                    worksheet.Cells[i + 2, 3].Value = instructors[i].FullName;
                    worksheet.Cells[i + 2, 4].Value = instructors[i].HireDate;
                }

                return package.GetAsByteArray();
            }
        }

    }


}
