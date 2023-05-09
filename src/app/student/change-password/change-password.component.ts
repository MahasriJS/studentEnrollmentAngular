import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Student } from '../../model/student';
import { StudentService } from '../../services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  reactiveForm: FormGroup;
  student: Student;
  constructor(private studentService: StudentService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required)
    });
    this.getStudentById();
  }
  getStudentById() {
    //const id: number = Number(this.route.snapshot.params.id);
    const id = window.localStorage.getItem('id');
    this.studentService.getStudentById(Number(id)).subscribe((response: any) => {
      this.student = response.data;
    });

  }
  onSubmit(): void {
    const email = this.reactiveForm.get('email').value;
    const newPassword = this.reactiveForm.get('newPassword').value;
    const confirmPassword = this.reactiveForm.get('confirmPassword').value;
    this.studentService.changePassword(email, newPassword, confirmPassword).subscribe((response: any) => {
      this.student = response.data;
      if (response.statusCode === 200) {
        this.router.navigate(['/login']);
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        alert("Invaild password");
      }
    });
  }
}
