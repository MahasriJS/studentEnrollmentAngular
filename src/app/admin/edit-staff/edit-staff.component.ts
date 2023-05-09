import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Department } from 'src/app/model/department';
import { Staff } from 'src/app/model/staff';
import { DepartmentService } from 'src/app/services/department.service';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-edit-staff',
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.css']
})
export class EditStaffComponent implements OnInit {

  reactiveForm: FormGroup;
  staff: Staff;
  departments: Department[];
  constructor(private staffService: StaffService, private route: ActivatedRoute, private toastrService: ToastrService) { }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      phno: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      dateOfJoining: new FormControl(null, Validators.required),
      salary: new FormControl(null, Validators.required),
      designation: new FormControl(null, Validators.required)
    });
    this.getStaffById();
  }
  getStaffById() {
    const id: number = Number(this.route.snapshot.params.id);
    this.staffService.getStaffById(Number(id)).subscribe((response: any) => {
      this.staff = response.data;
    });

  }
  onSubmit(): void {
    const id: number = Number(this.route.snapshot.params.id);
    const staff = this.reactiveForm.value;
    this.staffService.upadteStaff(id, staff)
      .subscribe((response: any) => {
        this.staff = response.data;
        if (response.statusCode === 200) {
          alert("Staff Updated Successfully!!")
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 422 && err.error.message === "Email is already exists.") {
          alert("Email is already exists.");
        }
        if (err.status === 422 && err.error.message === "Phno is already exists.") {
          alert("Phno is already exists.");
        }
      });
  }
}
