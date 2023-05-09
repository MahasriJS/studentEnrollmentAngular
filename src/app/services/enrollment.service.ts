import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../model/enrollment';
import { Enrollments } from '../model/enrollments';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private adminUrl = "http://localhost:8080/enrollment/admin/view";
  constructor(private http: HttpClient) { }

  getEnrollmentDetailsByAdmin(department: number, course: number, semester: number, staff:number, subject: number, academicYear:string): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const object = { deptId: department,courseId: course,semId: semester,staffId: staff,subjectId: subject, academicYear:academicYear }
    const body = JSON.stringify(object);
    console.log(body)
    return this.http.post(this.adminUrl, body, { 'headers': headers })
  }
 private studentUrl ="http://localhost:8080/enrollment/student/view";
 getEnrollmentDetailsByStudent(semester:number,studentId:number):Observable<any>{
  const headers = { 'content-type': 'application/json' }
  const object = { semId: semester, studentId:studentId }
  const body = JSON.stringify(object);
  console.log(body)
  return this.http.post(this.studentUrl, body, { 'headers': headers })
}
private availabilityUrl="http://localhost:8080/enrollment/available";
getEnrollmentAvailability(subjectId:number,studentId:number,staffId:number,semId:number,deptId:number,courseId:number): Observable<any>{
  const headers = { 'content-type': 'application/json' }
  const object = { subjectId:subjectId,semId: semId,studentId:studentId,staffId:staffId,deptId:deptId, courseId:courseId}
  const body = JSON.stringify(object);
  console.log(body)
  return this.http.post(this.availabilityUrl, body, { 'headers': headers })
}
private enrollmentUrl="http://localhost:8080/enrollment/";
getEnrollment(finalEnrollments: Enrollments[]): Observable<any[]>{
  const headers = { 'content-type': 'application/json' }
  //const object = { subjectId:subjectId,studentId:studentId,staffId:staffId}
  // const object={finalEnrollments:finalEnrollments}
  // const body = JSON.stringify(obj);
  // console.log(body)
  return this.http.post<any[]>(this.enrollmentUrl, finalEnrollments, {'headers': headers })
}
}

