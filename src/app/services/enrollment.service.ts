import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlUtils } from '../utils/url-utils';
import { EnrollmentDto } from '../model/enrollmentDto';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private http: HttpClient, private urlUtils: UrlUtils) { }
  private adminViewUrl = this.urlUtils.getBaseUrl() + "/enrollments/view/admin";
  getEnrollmentDetailsByAdmin(departmentId: number, courseId: number, semesterId: number, staffId: number, subjectId: number, academicYear: string): Observable<any> {
    const body = { deptId: departmentId, courseId: courseId, semId: semesterId, staffId: staffId, subjectId: subjectId, academicYear: academicYear }
    return this.http.post(this.adminViewUrl, body)
  }
  private studentViewUrl = this.urlUtils.getBaseUrl() + "/enrollments/view/student";
  getEnrollmentDetailsByStudent(semesterId: number, studentId: number): Observable<any> {
    const body = { semId: semesterId, studentId: studentId }
    return this.http.post(this.studentViewUrl, body)
  }
  private availabilityUrl = this.urlUtils.getBaseUrl() + "/enrollments/available";
  getEnrollmentAvailability(subjectId: number, studentId: number, staffId: number, semId: number, deptId: number, courseId: number): Observable<any> {
    const body = { subjectId: subjectId, semId: semId, studentId: studentId, staffId: staffId, deptId: deptId, courseId: courseId }
    return this.http.post(this.availabilityUrl, body)
  }

  private enrollmentUrl = this.urlUtils.getBaseUrl() + "/enrollments";
  saveEnrollment(finalEnrollments: EnrollmentDto[]): Observable<any[]> {
    return this.http.post<any[]>(this.enrollmentUrl, finalEnrollments)
  }
}

