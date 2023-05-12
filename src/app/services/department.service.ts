import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../model/department';
import { UrlUtils } from '../utils/url-utils';
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
 
  constructor(private http: HttpClient, private urlUtils: UrlUtils) { }
  
  private url = this.urlUtils.getBaseUrl() +"/departments";
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.url);
  }
}
