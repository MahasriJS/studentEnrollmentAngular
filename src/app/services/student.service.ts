import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../model/student';
import { UrlUtils } from '../utils/url-utils';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient,private urlUtils: UrlUtils) { }
  private url = this.urlUtils.getBaseUrl() +"/students/";
  addStudent(student: Student): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(student);
    console.log(body)
    return this.http.post(this.url, body, { 'headers': headers })
  }

  getUrl: string = this.urlUtils.getBaseUrl() +"/students/ids";
  getStudents(departmentId: number, courseId: number, academicYear: string): Observable<Student[]> {
    const body = { deptId: departmentId, courseId: courseId, academicYear: academicYear }
    return this.http.post<Student[]>(this.getUrl, body)
  }
 
  getStudentById(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(this.url + `${id}`);
  }
  updateStudent(id: number, student: Student): Observable<Student[]> {
    return this.http.put<Student[]>(this.url + `${id}`, student)
  }
 
  updateStudentAvailability(id: number, isAvailable: boolean): Observable<Student[]> {
    const headers = { 'content-type': 'application/json' }
    return this.http.patch<Student[]>(this.url + `${id}` + "?isAvailable=" + `${isAvailable}`, { 'headers': headers })
  }

  loginUrl = this.urlUtils.getBaseUrl() +"/login";
  studentLogin(email: string, password: string, userType: string): Observable<Student[]> {
    const body = { email: email, password: password, userType: userType }
    return this.http.post<Student[]>(this.loginUrl, body)
  }

  passwordUrl = this.urlUtils.getBaseUrl() +"/students/change-password";
  changePassword(email: string, newPassword: string, confirmPassword: string): Observable<Student[]> {
    const body = { email: email, newPassword: newPassword, confirmPassword: confirmPassword }
    return this.http.post<Student[]>(this.passwordUrl, body)
  }
  upgradeUrl = this.urlUtils.getBaseUrl() +"/students/upgrade";
  upgrade(academicYear: string, departmentId: number, courseId: number, semId: number): Observable<Student[]> {
    const body = { academicYear: academicYear, deptId: departmentId, courseId: courseId, semId: semId }
    return this.http.post<Student[]>(this.upgradeUrl, body)
  }

  academicYearUrl = this.urlUtils.getBaseUrl() +"/meta-data/academic-year";
  getAcademicYear(): Observable<String[]> {
    return this.http.get<String[]>(this.academicYearUrl)
  }
 
  checkSchedule(studentId: number): Observable<Boolean> {
    return this.http.get<Boolean>(this.url + `${studentId}` + "/check-schedule")
  }
}
