import { Injectable } from '@angular/core';
import { Subject } from '../model/subject';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlUtils } from '../utils/url-utils';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  
  constructor(private http: HttpClient,private urlUtils: UrlUtils) { }

  private url=  this.urlUtils.getBaseUrl() +"/subjects"
  addSubject(subject: Subject): Observable<any> {
    return this.http.post(this.url, subject)
  }
  
  getSubjects(courseId: number, semesterId: number): Observable<Subject[]> {
    const body = { courseId: courseId, semId: semesterId }
    return this.http.post<Subject[]>(this.url+"/ids", body)
  }
}
