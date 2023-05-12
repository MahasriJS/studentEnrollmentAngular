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
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-staff-assign-list',
  templateUrl: './staff-assign-list.component.html',
  styleUrls: ['./staff-assign-list.component.css']
})
export class StaffAssignListComponent implements OnInit {
  reactiveForm: FormGroup;
  staffs: Staff[];
  departments: Department[];
  subjects: Subject[];
  courses: Course[];
  semesters: Semester[];
  courseTypes: CourseType[];
  showTable = false;
  constructor(private departmentService: DepartmentService,
    private staffService: StaffService,
    private courseTypeService: CoursetypeService,
    private courseService: CourseService,
    private semesterService: SemesterService,
    private subjectService: SubjectService,
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
    this.reactiveForm = new FormGroup({
      department: new FormControl(null, Validators.required),
      courseType: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      semester: new FormControl(null, Validators.required),
      subject: new FormControl('')
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
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  assignStaffList(): void {
    const subjectId:number = Number(this.reactiveForm.get('subject').value);
    this.staffService.getAssignedStaffBySubjectId(subjectId).subscribe((response: any) => {
      this.staffs = response.data;
      if (response.statusCode === 200) {
        this.showTable = true;
      }
      if (response.statusCode === 200 && response.message === "Staffs Not Found") {
        this.toastrService.warning("No Data Found")
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Invalid Staff");
      }
    });
  }
}
