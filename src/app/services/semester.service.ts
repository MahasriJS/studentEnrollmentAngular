import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Semester } from '../model/semester';
import { UrlUtils } from '../utils/url-utils';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {

  private url = this.urlUtils.getBaseUrl() +"/courseTypes/";
  
  constructor(private http: HttpClient,private urlUtils: UrlUtils) { }
  getSemesters(courseTypeId: number): Observable<Semester[]> {
    return this.http.get<Semester[]>(this.url + `${courseTypeId}` + "/semesters");
  }
}
