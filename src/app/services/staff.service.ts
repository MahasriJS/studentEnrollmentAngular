import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Staff } from '../model/staff';
import { UrlUtils } from '../utils/url-utils';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  
  constructor(private http: HttpClient,private urlUtils: UrlUtils) { }
  private url = this.urlUtils.getBaseUrl() +"/staffs/";
  addStaff(staff: Staff): Observable<any> {
    return this.http.post(this.url, staff)
  }

  private  getStaffUrl = this.urlUtils.getBaseUrl() +"/staffs/ids";
  getStaffs(deptId: number[]): Observable<Staff[]> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(deptId);
    return this.http.post<Staff[]>(this. getStaffUrl,body,{'headers':headers})
  }
 
  getStaffById(id: number): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.url + `${id}`);
  }
  upadteStaff(id: number, staff: Staff): Observable<Staff[]> {
    return this.http.put<Staff[]>(this.url + `${id}`, staff)
  }
  updateStaffAvailability(id: number, isAvailable: boolean): Observable<Staff[]> {
    const headers = { 'content-type': 'application/json' }
    return this.http.patch<Staff[]>(this.url + `${id}` + "?isAvailable=" + `${isAvailable}`, { 'headers': headers })
  }
  assignUrl: string = this.urlUtils.getBaseUrl()+"/subjects/";
  assignStaffToSubject(staffId: number, subjectId: number): Observable<any> {
    const body = { staffId: staffId}
    return this.http.post(this.assignUrl+ `${subjectId}`+"/staffs/assign", body)
  }
  
  getAssignedStaffBySubjectId(subjectId: number): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.assignUrl + `${subjectId}` + "/staffs/assign");
  }
 
  private loginUrl = this.urlUtils.getBaseUrl() +"/login";
  adminLogin(email: string, password: string, userType: string): Observable<Staff[]> {
    const body = { email: email, password: password, userType: userType }
    return this.http.post<Staff[]>(this.loginUrl + "?userType=" + `${userType}`, body)
  }
}
