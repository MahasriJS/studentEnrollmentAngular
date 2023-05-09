import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  constructor(private studentService: StudentService) { }

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
    // const id: number = Number(this.route.snapshot.params.id);
    const id = window.localStorage.getItem('id');
    this.studentService.getStudentById(Number(id)).subscribe((response: any) => {
      this.student = response.data;
    });
  }
}
