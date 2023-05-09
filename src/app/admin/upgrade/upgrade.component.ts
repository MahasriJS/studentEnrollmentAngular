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


  constructor(private departmentService: DepartmentService,
    private courseTypeService: CoursetypeService,
    private courseService: CourseService,
    private semesterService: SemesterService, private studentService: StudentService,
    private toastrService: ToastrService) { }

  ngOnInit() {
    this.studentService.getAcademicYear()
      .subscribe((response: any) => {
        this.academicYears = response.data;
      });
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
      semester: new FormControl(null, Validators.required),
      academicYear: new FormControl(null, Validators.required)
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
    const academicYear = this.reactiveForm.get('academicYear').value;
    const deptId = this.reactiveForm.get('department').value;
    const courseTypeId = this.reactiveForm.get('courseType').value;
    const courseId = this.reactiveForm.get('course').value;
    const semId = this.reactiveForm.get('semester').value;
    if (courseTypeId == 1 && semId < 8 || courseTypeId == 2 && semId < 12) {
      this.studentService.upgrade(academicYear, Number(deptId), Number(courseId), Number(semId)).subscribe((response: any) => {
        //this.student = response.data;
        if (response.data === true) {
          alert("Upgrade Successfully!!");
        }
        if (response.data === false) {
          this.toastrService.error("Unable to Upgrade");
        }
      });
    }
    // else{
    //   this.toastrService.error("Unable to Upgrade");
    // }
  }
}
