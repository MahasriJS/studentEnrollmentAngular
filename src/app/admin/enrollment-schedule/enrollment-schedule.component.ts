import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Course } from 'src/app/model/course';
import { CourseType } from 'src/app/model/course-type';
import { Department } from 'src/app/model/department';
import { EnrollmentSchedule } from 'src/app/model/enrollment-schedule';
import { Semester } from 'src/app/model/semester';
import { Student } from 'src/app/model/student';
import { CourseService } from 'src/app/services/course.service';
import { CoursetypeService } from 'src/app/services/coursetype.service';
import { DepartmentService } from 'src/app/services/department.service';
import { EnrollmentScheduleService } from 'src/app/services/enrollment-schedule.service';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { SemesterService } from 'src/app/services/semester.service';
import { StaffService } from 'src/app/services/staff.service';
import { StudentService } from 'src/app/services/student.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-enrollment-schedule',
  templateUrl: './enrollment-schedule.component.html',
  styleUrls: ['./enrollment-schedule.component.css']
})
export class EnrollmentScheduleComponent implements OnInit {

  reactiveForm: FormGroup;
  students: Student[];
  scheduleEnrollments: EnrollmentSchedule[];
  departments: Department[];
  courses: Course[];
  semesters: Semester[];
  courseTypes: CourseType[];
  academicYears: string[];
  constructor(private departmentService: DepartmentService,
    private courseTypeService: CoursetypeService,
    private courseService: CourseService,
    private semesterService: SemesterService,
    private enrollmentScheduleService: EnrollmentScheduleService,
    private studentService: StudentService,
    private toastrService: ToastrService) { }

  ngOnInit() {

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
    this.studentService.getAcademicYear()
      .subscribe((response: any) => {
        this.academicYears = response.data;
      }, (err: HttpErrorResponse) => {
        if (err.status === 422) {
          this.toastrService.error("Academic Years Not Found");
        }
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
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Semesters Not Found");
      }
    });
  }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  scheduleEnrollment(): void {
    const scheduleEnrollment: EnrollmentSchedule = {
      isStarted: true,
      academicYear: this.reactiveForm.get('academicYear').value,
      deptId: this.reactiveForm.get('department').value,
      courseId: this.reactiveForm.get('course').value,
      semId: this.reactiveForm.get('semester').value,
    };
    this.enrollmentScheduleService.scheduleEnrollment(scheduleEnrollment)
      .subscribe(data => {
        console.log(data);
        if (data.statusCode === 200) {
          this.toastrService.success("Enrollment Scheduled Successfully!!");
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 422 && err.error.message === "Invalid Department Id or Course Id or Semester Id or academic year") {
          this.toastrService.error("Please Enter all required Details");
        }
        if (err.status === 422 && err.error.message === "Already Scheduled") {
          this.toastrService.warning("Scheduled Already");
        }

      });
  }
}

