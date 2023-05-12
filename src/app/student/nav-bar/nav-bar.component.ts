import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Student } from 'src/app/model/student';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  student: Student;
  name:string;
  constructor(private studentService: StudentService,private router: Router
    ,private toastrService: ToastrService) { }

  

  ngOnInit() {
    this.getStudentById();
  }
  getStudentById() {
    const id = window.localStorage.getItem('studentId');
    this.studentService.getStudentById(Number(id)).subscribe((response: any) => {
    this.student = response.data;
    this.name=this.student.name;
  }, (err: HttpErrorResponse) => {
    if (err.status === 422) {
      this.toastrService.error("Course Not Found");
    }
    });
  }

  logout() {
    window.localStorage.removeItem('studentId');
    this.toastrService.success("Logged Out Sucessfully!!");
    this.router.navigate(['/student/login']);
  }
}