import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Student } from 'src/app/model/student';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  reactiveForm: FormGroup;
  student: Student;

  constructor(private studentService: StudentService,
    private toastrService: ToastrService, private router: Router) { }

  ngOnInit() {

    this.reactiveForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      phno: new FormControl(null, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")),
      dob: new FormControl(null, Validators.required),
      dateOfJoining: new FormControl(null, Validators.required),

    });
    this.getStudentById();
  }
  getStudentById() {
    const id: number = Number(window.localStorage.getItem('studentId'));
    this.studentService.getStudentById(id).subscribe((response: any) => {
      this.student = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Student Not Found");
      }
    });

  }
  editProfile(): void {
    const id: number = Number(window.localStorage.getItem('studentId'));
    this.studentService.updateStudent(Number(id), this.student)
      .subscribe((response: any) => {
        this.student = response.data;
        if (response.statusCode === 200) {
          this.toastrService.success("Changes Saved Successfully!!")
          this.router.navigate(['/my-profile']);
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 422 && err.error.message === "Email is already exists.") {
          this.toastrService.error("Email is already exists.");

        }
        if (err.status === 422 && err.error.message === "Phno is already exists.") {
          this.toastrService.error("Phno is already exists.");

        }
        if (err.status === 422 && err.error.message === "Check  email or phone Pattern") {
          this.toastrService.error("Check email or phone Pattern");
        }
      });

  }

}
