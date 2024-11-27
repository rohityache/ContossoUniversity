export class DepartmentDto {
  departmentID: number = 0;
  name: string = '';
  budget: number = 0;
  startDate: Date = new Date();
  instructorID: number | null = null;
}
