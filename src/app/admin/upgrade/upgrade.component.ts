import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Course } from 'src/app/model/course';
import { CourseType } from 'src/app/model/course-type';
import { Department } from 'src/app/model/department';
import { Semester } from 'src/app/model/semester';
import { Student } from 'src/app/model/student';
import { CourseService } from 'src/app/services/course.service';
import { CoursetypeService } from 'src/app/services/coursetype.service';
import { DepartmentService } from 'src/app/services/department.service';
import { SemesterService } from 'src/app/services/semester.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent implements OnInit {
  reactiveForm: FormGroup;
  students: Student[];
  student: Student;
  departments: Department[];
  courses: Course[];
  semesters: Semester[];
  courseTypes: CourseType[];
  academicYears: string[];
  courseTypeMap: Map<number, CourseType>;
  semesterMap: Map<number, Semester>;

  constructor(private departmentService: DepartmentService,
    private courseTypeService: CoursetypeService,
    private courseService: CourseService,
    private semesterService: SemesterService, private studentService: StudentService,
    private toastrService: ToastrService) { }

  ngOnInit() {
    this.studentService.getAcademicYear()
      .subscribe((response: any) => {
        this.academicYears = response.data;
      }, (err: HttpErrorResponse) => {
        if (err.status === 422) {
          this.toastrService.error("Academic Years Not Found");
        }
      });
    this.departmentService.getDepartments()
      .subscribe((response: any) => {
        this.departments = response.data;
      }, (err: HttpErrorResponse) => {
        if (err.status === 422) {
          this.toastrService.error("Deparments Not Found");
        }
      });
    this.courseTypeService.getCourseTypes()
      .subscribe((response: any) => {
        this.courseTypes = response.data;
        this.courseTypeMap = new Map<number,CourseType>();
        this.courseTypes.forEach(courseType => {
        this.courseTypeMap.set(courseType.id, courseType);
      }, (err: HttpErrorResponse) => {
        if (err.status === 422) {
          this.toastrService.error("CourseTypes Not Found");
        }
      });
      });
    this.reactiveForm = new FormGroup({
      department: new FormControl(null, Validators.required),
      courseType: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      semester: new FormControl(null, Validators.required),
      academicYear: new FormControl(null, Validators.required)
    });
  }
  getCoursesByDepartmentAndCourseType(deptId: number, courseTypeId: number): void {
    this.courseService.getCourses(deptId, courseTypeId).subscribe((response: any) => {
      this.courses = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Courses Not Found");
      }
    });

  }

  getSemestersByCourseType(courseTypeId: number): void {
    this.semesterService.getSemesters(courseTypeId).subscribe((response: any) => {
      this.semesters = response.data;
      this.semesterMap = new Map<number,Semester>();
      this.semesters.forEach(semester => {
      this.semesterMap.set(semester.id, semester);
    });
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Semesters Not Found");
       
      }
    });
  }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  upgradeStudent(): void {
    const academicYear: string = this.reactiveForm.get('academicYear').value;
    const deptId:number = Number(this.reactiveForm.get('department').value);
    const courseTypeId:number = Number(this.reactiveForm.get('courseType').value);
    const courseId:number = Number(this.reactiveForm.get('course').value);
    const semId:number = Number(this.reactiveForm.get('semester').value);
    let courseType: CourseType= this.courseTypeMap.get(courseTypeId);
    let semester: Semester= this.semesterMap.get(semId);
    if (courseType.courseTypeName == "UG" && semester.order < 8 || courseType.courseTypeName == "PG" && semester.order< 4) {
      this.studentService.upgrade(academicYear, Number(deptId), Number(courseId), Number(semId)).subscribe((response: any) => {
        if (response.data === true) {
          this.toastrService.success("Upgrade Successfully!!");
        }
        if (response.data === false) {
          this.toastrService.error("Not All the students are Enrolled");
        }
      });
    }
  
  }
}
