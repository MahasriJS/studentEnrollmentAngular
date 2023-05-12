import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Course } from 'src/app/model/course';
import { CourseType } from 'src/app/model/course-type';
import { Department } from 'src/app/model/department';
import { Enrollment } from 'src/app/model/enrollment';
import { Semester } from 'src/app/model/semester';
import { Student } from 'src/app/model/student';
import { CoursetypeService } from 'src/app/services/coursetype.service';
import { DepartmentService } from 'src/app/services/department.service';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { SemesterService } from 'src/app/services/semester.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-enrollment-view',
  templateUrl: './enrollment-view.component.html',
  styleUrls: ['./enrollment-view.component.css']
})
export class EnrollmentViewComponent implements OnInit {
  reactiveForm: FormGroup;
  enrollments: Enrollment[];
  departments: Department[];
  courses: Course[];
  semesters: Semester[];
  courseTypes: CourseType[];
  showTable = false;
  student: Student;
  constructor(private departmentService: DepartmentService,
    private courseTypeService: CoursetypeService,
    private semesterService: SemesterService,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private toastrService: ToastrService) { }

  ngOnInit() {

    this.courseTypeService.getCourseTypes()
      .subscribe((response: any) => {
        this.courseTypes = response.data;
      }, (err: HttpErrorResponse) => {
        if (err.status === 422) {
          this.toastrService.error("CourseType Not Found");
        }
      });
    this.reactiveForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      courseType: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      semester: new FormControl(null, Validators.required)
    });
    this.getStudentById();
  }
  getStudentById() {
    const id: number = Number(window.localStorage.getItem('studentId'));
    this.studentService.getStudentById(id).subscribe((response: any) => {
      this.student = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Student Not Found");
      }
    });
  }

  getSemestersByCourseType(): void {
    const courseTypeId: number = Number(this.reactiveForm.get('courseType').value);
    this.semesterService.getSemesters(courseTypeId).subscribe((response: any) => {
      this.semesters = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Semester Not Found");
      }
    });
  }
  viewEnrollments(): void {

    const semId: number = Number(this.reactiveForm.get('semester').value);
    const studentId: number = Number(window.localStorage.getItem('studentId'));
    this.enrollmentService.getEnrollmentDetailsByStudent(semId, studentId).subscribe((response: any) => {
      this.enrollments = response.data;
      if (response.statusCode === 200 && response.message === "Enrollments Not Found") {
        this.toastrService.warning("Your are not Enrolled");
      }
      if (response.statusCode === 200 && response.message === "Enrollment details are retrieved Successfully!!") {
        this.showTable = true;
        this.toastrService.success("Enrollment details are retrieved Successfully!!");
      }

    }, (err: HttpErrorResponse) => {
      if (err.status === 422 && err.error.message === "Invalid password") {
        this.toastrService.error("Password mismatch");
      }
    });
  }
}
