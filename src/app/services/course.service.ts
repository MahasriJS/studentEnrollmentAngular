import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../model/course';



@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private url = "http://localhost:8080/course";
  constructor(private http: HttpClient) { }

  getCourses(department: number, coursetype: number): Observable<Course[]> {
    const headers = { 'content-type': 'application/json' }
    const object = { deptId: department, courseTypeId: coursetype }
    const body = JSON.stringify(object);
    console.log(body)
    return this.http.post<Course[]>(this.url, body, { 'headers': headers })
  }

}
