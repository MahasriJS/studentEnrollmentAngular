import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Student } from '../../model/student';
import { StudentService } from '../../services/student.service';
import { HttpErrorResponse } from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // email: string;
  // password: string;
  reactiveForm: FormGroup;
 // students: Student[];
  student: number;
  constructor( private studentService: StudentService,private router: Router, private toastrService : ToastrService) {}
  
  ngOnInit() {
    this.reactiveForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      id:new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  onSubmit(): void {
    const email = this.reactiveForm.get('email').value;
    const password = this.reactiveForm.get('password').value;
    const userType="Student";
    this.studentService.studentLogin(email,password,userType).subscribe((response: any) => {
      this.student = response.data;
      const id=this.student;
      localStorage.setItem('id',id.toString() );
      if(password!="temp" && response.statusCode === 200){
        this.router.navigate(['/my-profile']);
        }
        if(password==="temp" && response.statusCode === 200){
         this.changePassword(this.student);
        }
    },(err:HttpErrorResponse)=>{
      if (err.status === 422 && err.error.message==="student not found") {
       this.toastrService.error('NOT FOUND'); 
     // alert("Not found");
      }
      if(err.status === 422 && err.error.message==="Invalid username or password"){
       this.toastrService.error("Please Enter all required fields"); 
       // alert("Invaild email or Password");
      }
    });
  }
  changePassword(id:number): void {
    this.router.navigate(['/change-password', id]);
  }
}
