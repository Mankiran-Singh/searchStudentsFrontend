import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:5000/students'; // Make sure this URL is correct

  constructor(private http: HttpClient) {}

  searchStudents(query: string): Observable<any[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/all");
  }
}
