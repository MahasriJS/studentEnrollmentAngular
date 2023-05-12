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
      }, (err: HttpErrorResponse) => {
        if (err.status === 422) {
          this.toastrService.error("Department Not Found");
        }
      });
    this.reactiveForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      phno: new FormControl(null,  Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")),
      designation: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      dateofjoining: new FormControl(null, Validators.required),
      salary: new FormControl(null, Validators.required),

    });
  }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  addStaff(): void {
    const staff: Staff = {
      name: this.reactiveForm.value.name,
      email: this.reactiveForm.value.email,
      address: this.reactiveForm.value.address,
      phno: this.reactiveForm.value.phno,
      dob: this.reactiveForm.value.dob,
      dateOfJoining: this.reactiveForm.value.dateofjoining,
      isAvailable: true,
      academicYear: this.reactiveForm.value.academicyear,
      deptId: this.reactiveForm.get('department').value,
      salary: this.reactiveForm.value.salary,
      designation: this.reactiveForm.value.designation,
      type: "Staff",
    };
    this.staffService.addStaff(staff)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.toastrService.success("Staff Added Successfully!!")
          this.router.navigate(['/staff/list']);
        }

      }, (err: HttpErrorResponse) => {
        if (err.status === 422 && err.error.message === "Phone Number already exists.") {
          this.toastrService.warning("Phone Number is already exists");
        }

        if (err.status === 422 && err.error.message === "Email address is already exists.") {
          this.toastrService.warning("Email address is already exists");
        }
        if (err.status === 422 && err.error.message === "Invaild phoneNumber") {
          this.toastrService.warning("Invaild phoneNumber");
        }
        if (err.status === 422 && err.error.message === "Invaild email") {
          this.toastrService.warning("Invaild email");
        }
        if (err.status === 422 && err.error.message === "Invalid Department Id or User Type Id") {
          this.toastrService.error("Invalid Department Id or User Type Id");
        }
      });
  }
}

