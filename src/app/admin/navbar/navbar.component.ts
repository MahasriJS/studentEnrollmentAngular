import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Student } from 'src/app/model/student';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  student: Student;
  name:string;
  constructor(private staffService: StaffService,private router: Router,
    private toastrService:ToastrService) { }

  ngOnInit() {
    this.getStaffById();
  }
  getStaffById() {
    const adminId = window.localStorage.getItem('adminId');
    this.staffService.getStaffById(Number(adminId)).subscribe((response: any) => {
    this.student = response.data;
    this.name=this.student.name;
    });
  }
  logout() {
    window.localStorage.removeItem('adminId');
    this.router.navigate(['/admin/login']);
    this.toastrService.success("Logged out Successfully!!");
  }
}
