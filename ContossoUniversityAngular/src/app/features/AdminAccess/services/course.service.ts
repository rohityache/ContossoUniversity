import { Injectable } from '@angular/core';
import { CourseDto } from '../models/course-dto.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'https://localhost:7123/api/Course';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CourseDto[]> {
    return this.http.get<CourseDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<CourseDto> {
    return this.http.get<CourseDto>(`${this.apiUrl}/${id}`);
  }

  create(course: CourseDto): Observable<CourseDto> {
    return this.http.post<CourseDto>(this.apiUrl, course);
  }

  update(id: number, course: CourseDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, course);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
