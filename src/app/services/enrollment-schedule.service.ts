import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnrollmentSchedule } from '../model/enrollment-schedule';
import { UrlUtils } from '../utils/url-utils';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentScheduleService {

  constructor(private http: HttpClient, private urlUtils: UrlUtils) { }
  
  private url = this.urlUtils.getBaseUrl() + "/enrollments/schedule";
  scheduleEnrollment(scheduleEnrollment: EnrollmentSchedule): Observable<any> {
    return this.http.post(this.url, scheduleEnrollment);
  }

}
