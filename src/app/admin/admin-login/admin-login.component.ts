import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  reactiveForm: FormGroup;
  staffId: number;
  constructor(private staffService: StaffService, private router: Router, private toastrService: ToastrService) { }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      email: new FormControl(null, Validators.email),
      password: new FormControl(null, Validators.required),
    });
  }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  adminLogin(): void {
    const email: string = this.reactiveForm.get('email').value;
    const password: string = this.reactiveForm.get('password').value;
    const userType: string = "Admin";
    this.staffService.adminLogin(email, password, userType).subscribe((response: any) => {
      this.staffId = response.data;
      localStorage.setItem('adminId', this.staffId.toString());
      if (response.statusCode === 200 && response.message === "Logged in Successfully!!") {
        this.router.navigate(['/home']);
        this.toastrService.success("Logged in Successfully!!")
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422 && err.error.message === "staff not found") {
        this.toastrService.error("Invalid Username and Password");
        this.reactiveForm.reset();
      }
      if (err.status === 422 && err.error.message === "Email Not Found") {
        this.toastrService.error("Invalid Username");
        this.reactiveForm.reset();
      }
    });
  }
}
