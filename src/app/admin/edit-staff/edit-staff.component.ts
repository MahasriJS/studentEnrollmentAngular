import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Department } from 'src/app/model/department';
import { Staff } from 'src/app/model/staff';
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
  constructor(private staffService: StaffService, private route: ActivatedRoute,
    private toastrService: ToastrService, private router: Router) { }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      phno: new FormControl(null, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")),
      dob: new FormControl(null, Validators.required),
      dateOfJoining: new FormControl(null, Validators.required),
      salary: new FormControl(null, Validators.required),
      designation: new FormControl(null, Validators.required)
    });
    this.getStaffById();
  }
  getStaffById() {
    const id: number = Number(this.route.snapshot.params.id);
    this.staffService.getStaffById(id).subscribe((response: any) => {
      this.staff = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Staff Not Found");
      }
    });

  }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  editStaff(): void {
    const id: number = Number(this.route.snapshot.params.id);
    const staff:Staff = this.reactiveForm.value;
    this.staffService.upadteStaff(id, staff)
      .subscribe((response: any) => {
        this.staff = response.data;
        if (response.statusCode === 200) {
          this.toastrService.success("Changes Saved Successfully!!")
          this.router.navigate(['/staff/list']);
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 422 && err.error.message === "Email is already exists.") {
          this.toastrService.warning("Email is already exists.");
        }
        if (err.status === 422 && err.error.message === "Phno is already exists.") {
          this.toastrService.warning("Phno is already exists.");
        }
      });
  }
}

