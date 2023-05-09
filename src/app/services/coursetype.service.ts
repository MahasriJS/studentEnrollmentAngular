import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseType } from '../model/course-type';

@Injectable({
  providedIn: 'root'
})
export class CoursetypeService {

  private url = "http://localhost:8080/course-type";
  constructor(private http: HttpClient) { }

  getCourseTypes(): Observable<CourseType[]> {
    return this.http.get<CourseType[]>(this.url);
  }
}
