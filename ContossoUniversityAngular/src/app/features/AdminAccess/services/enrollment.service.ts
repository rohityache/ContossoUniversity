import { Injectable } from '@angular/core';
import { EnrollmentDto } from '../models/enrollment-dto.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private apiUrl = 'https://localhost:7123/api/Enrollment';

  constructor(private http: HttpClient) {}

  getAll(): Observable<EnrollmentDto[]> {
    return this.http.get<EnrollmentDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<EnrollmentDto> {
    return this.http.get<EnrollmentDto>(`${this.apiUrl}/${id}`);
  }

  create(enrollment: EnrollmentDto): Observable<EnrollmentDto> {
    return this.http.post<EnrollmentDto>(this.apiUrl, enrollment);
  }

  update(id: number, enrollment: EnrollmentDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, enrollment);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
