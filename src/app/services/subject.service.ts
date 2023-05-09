import { Injectable } from '@angular/core';
import { Subject } from '../model/subject';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  baseURL: string = "http://localhost:8080/subject";
  constructor(private http: HttpClient) { }
  addSubject(subject: Subject): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(subject);
    console.log(body)
    return this.http.post(this.baseURL, body, { 'headers': headers })
  }
  getUrl: string = "http://localhost:8080/subjects";
  getSubjects(courseId: number, semesterId: number): Observable<Subject[]> {
    const headers = { 'content-type': 'application/json' }
    const object = { courseId: courseId, semId: semesterId }
    const body = JSON.stringify(object);
    console.log(body)
    return this.http.post<Subject[]>(this.getUrl, body, { 'headers': headers })
  }
}
