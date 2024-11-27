import { Grade } from './grade.model';

export class EnrollmentDto {
  enrollmentID: number = 0;
  courseID: number = 0;
  studentID: number = 0;
  grade: Grade | null = null;
}
