import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  reactiveForm: FormGroup;
  students: Student[];
  student: Student;
  departments: Department[];
  courses: Course[];
  semesters: Semester[];
  courseTypes: CourseType[];
  showTable = false;
  academicYears: string[];
  constructor(private departmentService: DepartmentService,
    private courseTypeService: CoursetypeService,
    private courseService: CourseService,
    private studentService: StudentService, private router: Router, private toastrService: ToastrService) { }

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
          this.toastrService.error("Departments Not Found");
        }
      });
    this.courseTypeService.getCourseTypes()
      .subscribe((response: any) => {
        this.courseTypes = response.data;
      }, (err: HttpErrorResponse) => {
        if (err.status === 422) {
          this.toastrService.error("CourseTypes Not Found");
        }
      });
    this.reactiveForm = new FormGroup({
      department: new FormControl(null, Validators.required),
      courseType: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
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

  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  listStudent(): void {

    const deptId: number = Number(this.reactiveForm.get('department').value);
    const courseId: number = Number(this.reactiveForm.get('course').value);
    const academicYear: string = this.reactiveForm.get('academicYear').value;
    this.studentService.getStudents(deptId, courseId, academicYear).subscribe((response: any) => {
      this.students = response.data;

      if (response.statusCode === 200 && response.message === "Students retrieved Successfully!!") {
        this.showTable = true;
        this.toastrService.success("Students Retrieved Successfully");
      }
      if (response.statusCode === 200 && response.message === "Students Not Found") {
        this.showTable = false;
        this.toastrService.warning("No Students Found")
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422 && err.error.message === "Invalid Department Id or Course Id or Semester Id") {
        this.toastrService.error("Please enter the required values");

      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/student', id, 'edit']);
  }
  upgrade(student: Student) {
    this.router.navigate(['/upgrade']);
  }

  updateAvailability(student: Student) {
    const isAvailable = !student.isAvailable;
    this.studentService.updateStudentAvailability(Number(student.id), isAvailable).subscribe((response: any) => {
      this.student = response.data;
      if (response.statusCode === 200) {
        student.isAvailable = isAvailable;
        this.toastrService.success("Student Status Updated Successfully!!");
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        alert("Invaild");
        window.location.reload();
      }
    });
  }
}