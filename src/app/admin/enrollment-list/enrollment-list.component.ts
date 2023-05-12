import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'src/app/model/subject';
import { Course } from 'src/app/model/course';
import { CourseType } from 'src/app/model/course-type';
import { Department } from 'src/app/model/department';
import { Semester } from 'src/app/model/semester';
import { Staff } from 'src/app/model/staff';
import { CourseService } from 'src/app/services/course.service';
import { CoursetypeService } from 'src/app/services/coursetype.service';
import { DepartmentService } from 'src/app/services/department.service';
import { SemesterService } from 'src/app/services/semester.service';
import { StaffService } from 'src/app/services/staff.service';
import { SubjectService } from 'src/app/services/subject.service';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { Student } from 'src/app/model/student';
import { Enrollment } from 'src/app/model/enrollment';
import { HttpErrorResponse } from '@angular/common/http';
import { StudentService } from 'src/app/services/student.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-enrollment-list',
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.css']
})
export class EnrollmentListComponent implements OnInit {

  reactiveForm: FormGroup;
  students: Student[];
  enrollments: Enrollment[];
  staffs: Staff[];
  departments: Department[];
  subjects: Subject[];
  courses: Course[];
  semesters: Semester[];
  courseTypes: CourseType[];
  showTable = false;
  academicYears: string[];
  constructor(private departmentService: DepartmentService,
    private staffService: StaffService,
    private courseTypeService: CoursetypeService,
    private courseService: CourseService,
    private semesterService: SemesterService,
    private subjectService: SubjectService,
    private enrollmentService: EnrollmentService,
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
      staff: new FormControl(''),
      subject: new FormControl(''),
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
  getSubjectByCourseAndSemester(courseId: number, semId: number): void {
    this.subjectService.getSubjects(courseId, semId).subscribe((response: any) => {
      this.subjects = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Subjects Not Found");
      }
    });
  }

  getAssignedStaffsBySubjectId(){
    const subjectId:number=Number(this.reactiveForm.get('subject').value);
    this.staffService.getAssignedStaffBySubjectId(subjectId).subscribe((response: any) => {
      this.staffs = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Staffs Not Found");
      }
    });
  }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  viewEnrollment(): void {
    const deptId:number = Number(this.reactiveForm.get('department').value);
    const courseId:number = Number(this.reactiveForm.get('course').value);
    const semId:number= Number(this.reactiveForm.get('semester').value);
    const subjectId:number = Number(this.reactiveForm.get('subject').value);
    const staffId:number =Number(this.reactiveForm.get('staff').value);
    const academicYear:string = this.reactiveForm.get('academicYear').value;
    this.enrollmentService.getEnrollmentDetailsByAdmin(deptId, courseId, semId, subjectId, staffId, academicYear).subscribe((response: any) => {
      this.enrollments = response.data;
      if (response.statusCode === 200 && response.message === "Enrollment details are retrieved Successfully!!") {
        this.showTable = true;
        this.toastrService.success("Enrollment details are retrieved Successfully!!");
      }
      if (response.statusCode === 200 && response.message === "Enrollments Not Found") {
        this.toastrService.warning("Enrollments Not Found");
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Please enter the required values");
      }
    });
  }
}
