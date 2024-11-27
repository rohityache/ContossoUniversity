// auth.service.ts
import {
  Injectable,
  ɵflushModuleScopingQueueAsMuchAsPossible,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserRegistration } from '../models/UserRegistration';
import { Course } from '../models/Course';
import { DepartmentDto } from '../../features/AdminAccess/models/department-dto.model';
import { R3NgModuleMetadataKind } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7123/api/Account/login'; // API URL for login
  private apiUrlRegister = 'https://localhost:7123/api/Account/register'; // API URL for registration
  private baseUrl = 'https://localhost:7123/api';

  constructor(private http: HttpClient) {}
  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ email, password });

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      tap((response) => console.log('Login successful', response)),
      catchError(this.handleError<any>('login'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  registerUser(data: UserRegistration): Observable<any> {
    return this.http.post(this.apiUrlRegister, data, { responseType: 'text' });
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/Course`);
  }
  getDepartments(): Observable<DepartmentDto[]> {
    return this.http.get<DepartmentDto[]>(`${this.baseUrl}/Department`);
  }

  getCoursesByDept(deptId: number): Observable<Course[]> {
    return this.http.get<Course[]>(
      `${this.baseUrl}/Course/department/${deptId}`
    );
  }
}
