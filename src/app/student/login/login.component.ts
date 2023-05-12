import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  reactiveForm: FormGroup;
  studentId: number;
  constructor(private studentService: StudentService, private router: Router, private toastrService: ToastrService) { }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      email: new FormControl(null, Validators.email),
      password: new FormControl(null, Validators.required),
    });
  }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  login(): void {
    const email:string = this.reactiveForm.get('email').value;
    const password:string = this.reactiveForm.get('password').value;
    const userType:string = "Student";
    this.studentService.studentLogin(email, password, userType).subscribe((response: any) => {
      this.studentId = response.data;
      localStorage.setItem('studentId', this.studentId.toString());
      if (response.statusCode === 200) {
        this.toastrService.success("Logged in Successfully!!");
        this.router.navigate(['/my-profile']);
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422 && err.error.message === "student not found") {
        this.toastrService.error("Invalid Username and Password");
      }
      if (err.status === 422 && err.error.message === "Invalid username or password") {
        this.toastrService.error("Invalid username or password");
      }
      if (err.status === 422 && err.error.message === "Email Not Found") {
        this.toastrService.error("Invalid Username");
      }
    });
  }
}
