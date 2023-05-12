import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Student } from 'src/app/model/student';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit {
  student: Student;
  reactiveForm: FormGroup;
  constructor(private studentService: StudentService, private toastrService: ToastrService) { }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      phno: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      academicYear: new FormControl(null, Validators.required),
      dateOfJoining: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      semester: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
    });
    this.getStudentById();
  }
  getStudentById() {
    const id = Number(window.localStorage.getItem('studentId'));
    this.studentService.getStudentById(id).subscribe((response: any) => {
      this.student = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Student Not Found");
      }
    });
  }
}
