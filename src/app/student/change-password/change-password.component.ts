import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Student } from '../../model/student';
import { StudentService } from '../../services/student.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  reactiveForm: FormGroup;
  isChanged: boolean;
  student: Student;
  constructor(private studentService: StudentService, private router: Router, private toastrService: ToastrService) { }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required)
    });
    this.getStudentById();
  }
  getStudentById() {
    const id: number = Number(window.localStorage.getItem('id'));
    this.studentService.getStudentById(id).subscribe((response: any) => {
      this.student = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Student Not Found");
      }
    });

  }
  changePassword(): void {
    const email: string = this.reactiveForm.get('email').value;
    const newPassword: string = this.reactiveForm.get('newPassword').value;
    const confirmPassword: string = this.reactiveForm.get('confirmPassword').value;
    this.studentService.changePassword(email, newPassword, confirmPassword).subscribe((response: any) => {
      this.isChanged = response.data;
      if (response.statusCode === 200) {
        this.toastrService.success("Password Changed Successfully!!");
        this.router.navigate(['/login']);
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422 && err.error.message === "Invalid password") {
        this.toastrService.error("Password mismatch");
      }
    });
  }
}
