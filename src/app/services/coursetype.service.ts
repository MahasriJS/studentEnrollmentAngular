import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseType } from '../model/course-type';
import { UrlUtils } from '../utils/url-utils';

@Injectable({
  providedIn: 'root'
})
export class CoursetypeService {

  constructor(private http: HttpClient, private urlUtils: UrlUtils) { }
  private url = this.urlUtils.getBaseUrl() + "/course-types";
  getCourseTypes(): Observable<CourseType[]> {
    return this.http.get<CourseType[]>(this.url);
  }
}
