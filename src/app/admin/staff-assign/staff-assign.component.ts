import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-staff-assign',
  templateUrl: './staff-assign.component.html',
  styleUrls: ['./staff-assign.component.css']
})
export class StaffAssignComponent implements OnInit {
  reactiveForm: FormGroup;
  staffs: Staff[];
  departments: Department[];
  subjects: Subject[];
  courses: Course[];
  semesters: Semester[];
  courseTypes: CourseType[];

  constructor(private departmentService: DepartmentService,
    private staffService: StaffService,
    private courseTypeService: CoursetypeService,
    private courseService: CourseService,
    private semesterService: SemesterService,
    private subjectService: SubjectService,
    private router: Router, private toastrService: ToastrService) { }

  ngOnInit() {
    this.departmentService.getDepartments()
      .subscribe((response: any) => {
        this.departments = response.data;
      }, (err: HttpErrorResponse) => {
        if (err.status === 422) {
          this.toastrService.error("Department Not Found");
        }
      });
    this.courseTypeService.getCourseTypes()
      .subscribe((response: any) => {
        this.courseTypes = response.data;
      }, (err: HttpErrorResponse) => {
        if (err.status === 422) {
          this.toastrService.error("CourseType Not Found");
        }
      });
    this.reactiveForm = new FormGroup({
      department: new FormControl(null, Validators.required),
      courseType: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      semester: new FormControl(null, Validators.required),
      staff: new FormControl(''),
      subject: new FormControl('')
    });
  }
  getCoursesByDepartmentAndCourseType(deptId: number, courseTypeId: number): void {
    this.courseService.getCourses(deptId,courseTypeId).subscribe((response: any) => {
      this.courses = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Course Not Found");
      }
    });

  }

  getSemestersByCourseType(courseTypeId: number): void {
    this.semesterService.getSemesters(courseTypeId).subscribe((response: any) => {
      this.semesters = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Semester Not Found");
      }
    });
  }
  getSubjectByCourseAndSemester(courseId: number, semId: number): void {
    this.subjectService.getSubjects(courseId, semId).subscribe((response: any) => {
      this.subjects = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Subject Not Found");
      }
    });
  }
  getStaffsByDepartment(deptId: number) {
    const deptIds:number[] =[];
    deptIds.push(Number(deptId))
    this.staffService.getStaffs(deptIds).subscribe((response: any) => {
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
  assignStaff(): void {
    const subjectId:number = Number(this.reactiveForm.get('subject').value);
    const staffId :number= Number(this.reactiveForm.get('staff').value);
    this.staffService.assignStaffToSubject(staffId, subjectId).subscribe((response: any) => {
      this.subjects = response.data;
      if (response.statusCode === 200) {
        this.toastrService.success("Staff Assigned Successfully!!")
        this.router.navigate(['/staff/assign/list']);
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422 && err.error.message === "Invalid Staff Id or Subject Id") {
        this.toastrService.error("Please Enter all required details");

      }
      if (err.status === 422 && err.error.message === "Unable to assign staff") {
        this.toastrService.error("Staff already assigned to this subject");

      }
    });
  }
}
