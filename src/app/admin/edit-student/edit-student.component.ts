import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Student } from 'src/app/model/student';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  reactiveForm: FormGroup;
  student: Student;
  constructor(private studentService: StudentService, private route: ActivatedRoute,
    private toastrService: ToastrService) { }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      phno: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      academicYear: new FormControl(null, Validators.required),
      dateOfJoining: new FormControl(null, Validators.required)
    });
    this.getStudentById();
    this.reactiveForm.value();
  }
  getStudentById() {
    const id: number = Number(this.route.snapshot.params.id);
    this.studentService.getStudentById(Number(id)).subscribe((response: any) => {
    this.student = response.data;
    console.log(this.student.name);
    });

  }
  onSubmit(): void {
    console.log(this.student.name);
    console.log(this.reactiveForm);
    const id: number = Number(this.route.snapshot.params.id);
    const student = this.reactiveForm.value;
    this.studentService.updateStudent(id, student)
      .subscribe((response: any) => {
        this.student = response.data;
        if(response.statusCode === 200){
         this.toastrService.success("Student Updated Successfully!!")
          }
        },(err:HttpErrorResponse)=>{
          if(err.status === 422 && err.error.message==="Email is already exists."){
            this.toastrService.warning("Email is already exists.");
           // window.location.reload();
          }
          if(err.status === 422 && err.error.message==="Phno is already exists."){
            this.toastrService.warning("Phno is already exists.");
           // window.location.reload();
          }
        });
    
  }
}
