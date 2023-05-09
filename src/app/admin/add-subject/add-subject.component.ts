import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from 'src/app/model/course';
import { CourseType } from 'src/app/model/course-type';
import { Department } from 'src/app/model/department';
import { Semester } from 'src/app/model/semester';
import { CourseService } from 'src/app/services/course.service';
import { CoursetypeService } from 'src/app/services/coursetype.service';
import { DepartmentService } from 'src/app/services/department.service';
import { SemesterService } from 'src/app/services/semester.service';
import { Subject } from 'src/app/model/subject';
import { SubjectService } from 'src/app/services/subject.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.css']
})
export class AddSubjectComponent implements OnInit {

  reactiveForm: FormGroup;
  departments: Department[];
  courseTypes: CourseType[];
  courses: Course[];
  semesters: Semester[];
  submitted = false;

  constructor(private departmentService: DepartmentService, private subjectService: SubjectService,
    private courseTypeService: CoursetypeService, private courseService: CourseService, private fb: FormBuilder,
    private semesterService: SemesterService,private router: Router, private toastrService:ToastrService) {
    // this.reactiveForm = this.fb.group({
    //   deptId: [''],
    //   courseType: [''],
    //   courseId: [''],
    //   semId: ['']
    // });
  }


  ngOnInit() {
    this.departmentService.getDepartments()
      .subscribe((response: any) => {
        this.departments = response.data;
      });
    this.courseTypeService.getCourseTypes()
      .subscribe((response: any) => {
        this.courseTypes = response.data;
      });
    this.reactiveForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      code: new FormControl(null, Validators.required),
      credits: new FormControl(0,Validators.required),
      department: new FormControl(null, Validators.required),
      courseType: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      semester: new FormControl(null, Validators.required)
    });
  }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }

  getCoursesByDepartmentAndCourseType(deptId: number, courseTypeId: number): void {
    this.courseService.getCourses(Number(deptId), Number(courseTypeId)).subscribe((response: any) => {
      this.courses = response.data;
    });
  }

  getSemestersByCourseType(courseTypeId: number): void {
    this.semesterService.getSemesters(Number(courseTypeId)).subscribe((response: any) => {
      this.semesters = response.data;
    });
  }

  onSubmit() :void{
    console.log(this.reactiveForm);
    const subject: Subject = {
      name: this.reactiveForm.value.name,
      code: this.reactiveForm.value.code,
      courseId: this.reactiveForm.get('course').value,
      semesterId: this.reactiveForm.get('semester').value,
      credits:this.reactiveForm.value.credits
    };
    console.log(subject);
    this.subjectService.addSubject(subject)
      .subscribe(data => {
        console.log(data);
        if(data.statusCode === 200){
         this.toastrService.success("Subject Added Successfully!!")
          this.router.navigate(['/subject-list']);
          }
        },(err:HttpErrorResponse)=>{
          if(err.status === 422 && err.error.message==="Unable to add subject"){
            this.toastrService.error("Unable to add subject");
          }
          if(err.status === 422 && err.error.message==="Code is already exists."){
            this.toastrService.warning("Subject Code is already exists.");
          }
          if(err.status === 422 && err.error.message==="Invalid Course Id or Semester Id"){
            this.toastrService.error("Please Enter all Required filed");
          }
          
        });
  }
}

