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
      });
    this.courseTypeService.getCourseTypes()
      .subscribe((response: any) => {
        this.courseTypes = response.data;
      });
    this.studentService.getAcademicYear()
      .subscribe((response: any) => {
        this.academicYears = response.data;
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
    this.courseService.getCourses(Number(deptId), Number(courseTypeId)).subscribe((response: any) => {
      this.courses = response.data;
    });

  }

  getSemestersByCourseType(courseTypeId: number): void {
    this.semesterService.getSemesters(Number(courseTypeId)).subscribe((response: any) => {
      this.semesters = response.data;
    });
  }
  getSubjectByCourseAndSemester(courseId: number, semId: number): void {
    this.subjectService.getSubjects(Number(courseId), Number(semId)).subscribe((response: any) => {
      this.subjects = response.data;
    });
  }
  getStaffsByDepartment(deptId: number) {
    this.staffService.getStaffs(Number(deptId)).subscribe((response: any) => {
      this.staffs = response.data;
    });
  }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  onSubmit(): void {
    const deptId = this.reactiveForm.get('department').value;
    const courseId = this.reactiveForm.get('course').value;
    const semId = this.reactiveForm.get('semester').value;
    const subjectId = this.reactiveForm.get('subject').value;
    const staffId = this.reactiveForm.get('staff').value;
    const academicYear = this.reactiveForm.get('academicYear').value;
    this.enrollmentService.getEnrollmentDetailsByAdmin(Number(deptId), Number(courseId), Number(semId), Number(subjectId), Number(staffId), academicYear).subscribe((response: any) => {
      this.enrollments = response.data;
      if (response.statusCode === 200 && response.message === "Enrollment retrieved Successfully!!") {
        this.showTable = true;
        this.toastrService.success("Enrollment retrieved Successfully!!");
      }
      if (response.statusCode === 200 && response.message === "Enrollments Not Found") {
        this.toastrService.warning("No Data Found");
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Please enter the required values");
      }
    });
  }
}
