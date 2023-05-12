import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { UrlUtils } from '../utils/url-utils';



@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient,
    private urlUtils: UrlUtils) { }

  private url = this.urlUtils.getBaseUrl() + "/courses";
  getCourses(deptId: number, coursetypeId: number): Observable<Course[]> {
    const body = { deptId: deptId, courseTypeId: coursetypeId }
    return this.http.post<Course[]>(this.url, body)
  }

}
