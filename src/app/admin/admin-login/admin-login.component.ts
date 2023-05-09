import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Staff } from 'src/app/model/staff';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  reactiveForm: FormGroup;
  //staff: Staff;
  staff: number;
  constructor(private staffService: StaffService, private router: Router, private toastrService: ToastrService) { }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  onSubmit(): void {
    const email = this.reactiveForm.get('email').value;
    const password = this.reactiveForm.get('password').value;
    const userType = "Admin";
    this.staffService.adminLogin(email, password, userType).subscribe((response: any) => {
      this.staff = response.data;
      const id = this.staff;
      localStorage.setItem('id', id.toString());
      if (response.statusCode === 200 && response.message === "Login Successfully!!") {
        this.router.navigate(['/home']);
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422 && err.error.message === "staff not found") {
        this.toastrService.error("Not found");
      }
      if (err.status === 422 && err.error.message === "Invalid username or password") {
        this.toastrService.error("Invaild email or Password");
      }
    });
  }
}
