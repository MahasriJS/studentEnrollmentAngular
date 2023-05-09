import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Department } from 'src/app/model/department';
import { Staff } from 'src/app/model/staff';
import { DepartmentService } from 'src/app/services/department.service';
import { StaffService } from 'src/app/services/staff.service';


@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent implements OnInit {
  reactiveForm: FormGroup;
  departments: Department[];
  constructor(private departmentService: DepartmentService, private staffService: StaffService,
    private router: Router, private toastrService: ToastrService) { }

  ngOnInit() {
    this.departmentService.getDepartments()
      .subscribe((response: any) => {
        this.departments = response.data;
      });
    this.reactiveForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      phno: new FormControl(null, Validators.required),
      designation: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      dateofjoining: new FormControl(null, Validators.required),
      salary: new FormControl(null, Validators.required),

    });
  }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  onSubmit(): void {
    console.log(this.reactiveForm);
    const staff: Staff = {
      name: this.reactiveForm.value.name,
      email: this.reactiveForm.value.email,
      address: this.reactiveForm.value.address,
      phno: this.reactiveForm.value.phno,
      dob: this.reactiveForm.value.dob,
      dateOfJoining: this.reactiveForm.value.dateofjoining,
      isAvailable: true,
      academicYear: this.reactiveForm.value.academicyear,
      password: "temp",
      deptId: this.reactiveForm.get('department').value,
      salary: this.reactiveForm.value.salary,
      designation: this.reactiveForm.value.designation,
      type: "Staff",
    };
    console.log(staff);
    this.staffService.addStaff(staff)
      .subscribe((response: any) => {
        console.log(response);
        if (response.statusCode === 200) {
          this.router.navigate(['/student-list']);
        }

      }, (err: HttpErrorResponse) => {
        if (err.status === 422 && err.error.message === "Phone Number already exists.") {
          this.toastrService.warning("Phone Number is already exists");
        }

        if (err.status === 422 && err.error.message === "Email address is already exists.") {
          this.toastrService.warning("Email address is already exists");
        }
        if (err.status === 422 && err.error.message === "Check  email or phone Pattern") {
          this.toastrService.error("Check email or phone Pattern");
        }
        if (err.status === 422 && err.error.message === "Invalid Department Id or User Type Id") {
          this.toastrService.error("Please Enter all required filed");
        }
      });
  }
}

