using ContosoUniversity.Services;
using Microsoft.AspNetCore.Mvc;

namespace ContosoUniversity.Controllers
{
    public class ReportController : Controller
    {
        private readonly ReportService _reportService;
        public ReportController(ReportService reportService)
        {
            _reportService = reportService;
        }

        public IActionResult DownloadStudentsByCourseReport(string courseName)
        {
            var fileBytes = _reportService.GenerateStudentsByCourseReport(courseName);
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "StudentsByCourse.xlsx");
        }

        public IActionResult DownloadInstructorsWithCourseReport()
        {
            var fileBytes = _reportService.GenerateInstructorsWithCourseReport();
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "InstructorsWithCourse.xlsx");
        }

        public IActionResult DownloadInstructorByDepartment(string departmentName)
        {
            var fileBytes = _reportService.GenerateInstructorByDepartmentReport(departmentName);
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "InstructorsByDepartment.xlsx");
        }

    }
}
