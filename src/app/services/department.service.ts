import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../model/department';
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private url = "http://localhost:8080/department";
  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.url);
  }
}
