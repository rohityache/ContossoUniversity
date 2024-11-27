import { Injectable } from '@angular/core';
import { InstructorDto } from '../models/instructor-dto.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private apiUrl = 'https://localhost:7123/api/Instructor';

  constructor(private http: HttpClient) {}

  getAll(): Observable<InstructorDto[]> {
    return this.http.get<InstructorDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<InstructorDto> {
    return this.http.get<InstructorDto>(`${this.apiUrl}/${id}`);
  }

  create(instructor: InstructorDto): Observable<InstructorDto> {
    return this.http.post<InstructorDto>(this.apiUrl, instructor);
  }

  update(id: number, instructor: InstructorDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, instructor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
