import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnrollmentSchedule } from '../model/enrollment-schedule';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentScheduleService {

  baseURL: string = "http://localhost:8080/schedule-enrollment";
  constructor(private http: HttpClient) { }
  scheduleEnrollment(scheduleEnrollment:EnrollmentSchedule): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(scheduleEnrollment);
    console.log(body)
    return this.http.post(this.baseURL , body,{'headers':headers})
  }
 
}
