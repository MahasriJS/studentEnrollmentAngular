import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../model/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  baseURL: string = "http://localhost:8080/student";
  constructor(private http: HttpClient) { }
  addStudent(student:Student): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(student);
    console.log(body)
    return this.http.post(this.baseURL , body,{'headers':headers})
  }
 
  getUrl:string="http://localhost:8080/students";
  getStudents(departmentId: number, courseId: number, academicYear:string): Observable<Student[]> {
    const headers = { 'content-type': 'application/json' }
    const object = { deptId: departmentId, courseId: courseId,academicYear:academicYear }
    const body = JSON.stringify(object);
    console.log(body)
    return this.http.post<Student[]>(this.getUrl, body, { 'headers': headers })
  }
  private url="http://localhost:8080/student/";
  getStudentById(id:number): Observable<Student[]> {
    return this.http.get<Student[]>(this.url+ `${id}`);
  }
  updateStudent(id:number, student :Student): Observable<Student[]> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(student);
    console.log(body)
    return this.http.put<Student[]>(this.url+ `${id}` , body, { 'headers': headers })
  }
  URL="http://localhost:8080/student/";
 updateStudentAvailability(id:number, isAvailable:boolean): Observable<Student[]> {
  const headers = { 'content-type': 'application/json' }
  return this.http.patch<Student[]>(this.url+ `${id}`+"?isAvailable="+`${isAvailable}`, {'headers': headers })
}
  loginUrl="http://localhost:8080/login";
  studentLogin(email:string, password:string,userType:string) : Observable<Student[]> {
    const headers = { 'content-type': 'application/json' }
    const object = { email: email, password:password, userType:userType}
    const body = JSON.stringify(object);
    console.log(body)
    return this.http.post<Student[]>(this.loginUrl, body, { 'headers': headers })
  }

  passwordUrl="http://localhost:8080/change-password";
  changePassword(email:string, newPassword:string, confirmPassword: string) : Observable<Student[]> {
    const headers = { 'content-type': 'application/json' }
    const object = { email: email, newPassword:newPassword, confirmPassword:confirmPassword }
    const body = JSON.stringify(object);
    console.log(body)
    return this.http.post<Student[]>(this.passwordUrl, body, { 'headers': headers })
  }
  upgradeUrl="http://localhost:8080/upgrade";
  upgrade(academicYear:string,departmentId: number, courseId: number,semId:number): Observable<Student[]> {
    const headers = { 'content-type': 'application/json' }
    const object = { academicYear:academicYear,deptId: departmentId, courseId: courseId,semId:semId }
    const body = JSON.stringify(object);
    return this.http.post<Student[]>(this.upgradeUrl,body, {'headers': headers })
  }

  academicYearUrl="http://localhost:8080/academic-year";
  getAcademicYear(): Observable<String[]> {
    const headers = { 'content-type': 'application/json' }
    return this.http.get<String[]>(this.academicYearUrl, { 'headers': headers })
  }

  isStartedUrl="http://localhost:8080/student/";
  checkSchedule(studentId:number):Observable<Boolean>{
    const headers = { 'content-type': 'application/json' }
    return this.http.get<Boolean>(this.isStartedUrl+`${studentId}`+"/check-schedule",{ 'headers': headers } )
  }
}
