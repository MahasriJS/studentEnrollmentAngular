import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Department } from 'src/app/model/department';
import { Staff } from 'src/app/model/staff';
import { DepartmentService } from 'src/app/services/department.service';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {

  reactiveForm: FormGroup;
  staffs: Staff[];
  staff:Staff;
  departments: Department[];
  showTable = false;
  constructor(private departmentService: DepartmentService,
    private staffService: StaffService,private router: Router
    ,private toastrService: ToastrService) { }
  ngOnInit() {
    this.departmentService.getDepartments()
    .subscribe((response: any) => {
      this.departments = response.data;
    });
    this.reactiveForm = new FormGroup({
      department: new FormControl(null, Validators.required)
    });
  }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  onSubmit(): void {
    const deptId = this.reactiveForm.get('department').value;
    this.staffService.getStaffs(Number(deptId)).subscribe((response: any) => {
    this.staffs = response.data;
    if(response.statusCode===200 && response.message==="Staff retrieved Successfully"){
      this.showTable = true;
      this.toastrService.success("Staff retrieved Successfully");
    }
    if(response.statusCode===200 && response.message==="Staffs Not Found"){
      this.toastrService.error("No Date Found");
    }
    });
    
  }
  edit(id:number): void {
    this.router.navigate(['/staff', id, 'edit']);
  }
  updateAvailability(staff:Staff){
    const isAvailable = !staff.isAvailable;
    this.staffService.updateStaffAvailability(Number(staff.id), isAvailable).subscribe((response: any) => {
      this.staff=response.data;
      if(response.statusCode === 200){
        staff.isAvailable = isAvailable;
      }
    },(err:HttpErrorResponse)=>{
      if(err.status === 422){
        this.toastrService.error("Unable to UpdateAvailability");
      }
      });
  }
}
