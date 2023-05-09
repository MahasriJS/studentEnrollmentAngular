import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Semester } from '../model/semester';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {

  private url = "http://localhost:8080/courseType/";
  constructor(private http: HttpClient) { }
  getSemesters(courseTypeId: number): Observable<Semester[]> {
    return this.http.get<Semester[]>(this.url + `${courseTypeId}` + "/semester");
  }
}
