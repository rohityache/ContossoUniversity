import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentDto } from '../models/student-dto.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'https://localhost:7123/api/Student';

  constructor(private http: HttpClient) {}

  getAll(): Observable<StudentDto[]> {
    return this.http.get<StudentDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<StudentDto> {
    return this.http.get<StudentDto>(`${this.apiUrl}/${id}`);
  }

  create(student: StudentDto): Observable<StudentDto> {
    return this.http.post<StudentDto>(this.apiUrl, student);
  }

  update(id: number, student: StudentDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, student);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
