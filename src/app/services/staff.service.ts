import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Staff } from '../model/staff';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  baseURL: string = "http://localhost:8080/staff";
  constructor(private http: HttpClient) { }
  addStaff(staff:Staff): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(staff);
    console.log(body)
    return this.http.post(this.baseURL , body,{'headers':headers})
  }
  getUrl:string="http://localhost:8080/department/";
  getStaffs(deptId: number): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.getUrl + `${deptId}`+"/staffs");
  }
  private url="http://localhost:8080/staff/";
  getStaffById(id:number): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.url+ `${id}`);
  }
  upadteStaff(id:number, staff :Staff): Observable<Staff[]> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(staff);
    console.log(body)
    return this.http.put<Staff[]>(this.url+ `${id}` , body, { 'headers': headers })
  }
  updateStaffAvailability(id:number, isAvailable:boolean): Observable<Staff[]> {
    const headers = { 'content-type': 'application/json' }
    return this.http.patch<Staff[]>(this.url+ `${id}`+"?isAvailable="+`${isAvailable}`, {'headers': headers })
  }
  Url: string = "http://localhost:8080/staff-assign";
  assignStaffToSubject(staff:number,subject:number): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const object = { staffId: staff, subjectId: subject }
    const body = JSON.stringify(object);
    console.log(body)
    return this.http.post(this.Url,body,{'headers':headers})
  }
 assignUrl:string="http://localhost:8080/subjects/"
  getAssignedStaff(subjectId:number): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.assignUrl + `${subjectId}`+"/staffs");
  }
  loginUrl="http://localhost:8080/login";
  adminLogin(email:string, password:string, userType:string) : Observable<Staff[]> {
    const headers = { 'content-type': 'application/json' }
    const object = { email: email, password:password, userType:userType }
    const body = JSON.stringify(object);
    console.log(body)
    return this.http.post<Staff[]>(this.loginUrl+"?userType="+`${userType}`, body, { 'headers': headers })
  }
}
