import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Department } from 'src/app/model/department';
import { Student } from 'src/app/model/student';
import { DepartmentService } from 'src/app/services/department.service';
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
      phno: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      dateOfJoining: new FormControl(null, Validators.required),

    });
    this.getStudentById();
    //  this.reactiveForm.value();
  }
  getStudentById() {
    const id = window.localStorage.getItem('id');
    this.studentService.getStudentById(Number(id)).subscribe((response: any) => {
      this.student = response.data;
      console.log(this.student.name);
      console.log(this.reactiveForm);
    });

  }
  onSubmit(): void {
    console.log(this.student.name);
    console.log(this.reactiveForm);
    //const student = this.reactiveForm.value;
    const id = window.localStorage.getItem('id');
    this.studentService.updateStudent(Number(id), this.student)
      .subscribe((response: any) => {
        this.student = response.data;
        if (response.statusCode === 200) {
          alert("Student Updated Successfully!!")
          this.router.navigate(['/my-profile']);
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 422 && err.error.message === "Email is already exists.") {
          alert("Email is already exists.");
        
        }
        if (err.status === 422 && err.error.message === "Phno is already exists.") {
          alert("Phno is already exists.");
         
        }
        if (err.status === 422 && err.error.message === "Check  email or phone Pattern") {
          alert("Check email or phone Pattern");
        }
      });

  }

}
