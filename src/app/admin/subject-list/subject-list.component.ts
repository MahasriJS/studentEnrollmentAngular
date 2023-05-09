import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Course } from 'src/app/model/course';
import { CourseType } from 'src/app/model/course-type';
import { Department } from 'src/app/model/department';
import { Semester } from 'src/app/model/semester';
import { Subject } from 'src/app/model/subject';
import { CourseService } from 'src/app/services/course.service';
import { CoursetypeService } from 'src/app/services/coursetype.service';
import { DepartmentService } from 'src/app/services/department.service';
import { SemesterService } from 'src/app/services/semester.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {
  reactiveForm: FormGroup;
  subjects: Subject[];
  departments: Department[];
  courses: Course[];
  semesters: Semester[];
  courseTypes: CourseType[];
  showTable = false;
  constructor(private departmentService: DepartmentService,
    private courseTypeService: CoursetypeService,
    private courseService: CourseService,
    private semesterService: SemesterService,
    private subjectService: SubjectService,
    private toastrService: ToastrService) { }

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
      department: new FormControl(null, Validators.required),
      courseType: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      semester: new FormControl(null, Validators.required)
    });

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
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  onSubmit(): void {
    
    const courseId = this.reactiveForm.get('course').value;
    const semId = this.reactiveForm.get('semester').value;
    this.subjectService.getSubjects(Number(courseId), Number(semId)).subscribe((response: any) => {
      this.subjects = response.data;
      if(response.statusCode===200 && response.message==="Subjets retrieved Successfully!!"){
        this.showTable = true;
        this.toastrService.success("Subjets retrieved Successfully!!");
      }
      if(response.statusCode===200 && response.message==="Subjects Not Found"){
        this.toastrService.warning("No Data Found");
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Please enter the required values");
      }
    });
  }
}
