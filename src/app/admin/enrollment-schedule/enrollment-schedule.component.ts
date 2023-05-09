import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Course } from 'src/app/model/course';
import { CourseType } from 'src/app/model/course-type';
import { Department } from 'src/app/model/department';
import { Enrollment } from 'src/app/model/enrollment';
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
      isStarted: new FormControl(null, Validators.required),
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
    //   const deptId = this.reactiveForm.get('department').value;
    //   const courseId = this.reactiveForm.get('course').value;
    //   const semId = this.reactiveForm.get('semester').value;
    //   const subjectId = this.reactiveForm.get('subject').value;
    //   const staffId = this.reactiveForm.get('staff').value;
    //   const academicYear=this.reactiveForm.get('academicYear').value;
    //     this.enrollmentSchdeuleService.scheduleEnrollment(Number(deptId), Number(courseId), Number(semId),academicYear).subscribe((response: any) => {
    //     this.scheduleEnrollments = response.data;
    //     },(err:HttpErrorResponse)=>{
    //       if(err.status === 422){
    //         alert("Please enter the required values");
    //       }
    //     });
    // }
    const scheduleEnrollment: EnrollmentSchedule = {
      isStarted: this.reactiveForm.value.isStarted,
      academicYear: this.reactiveForm.get('academicYear').value,
      deptId: this.reactiveForm.get('department').value,
      courseId: this.reactiveForm.get('course').value,
      semId: this.reactiveForm.get('semester').value,

    };
    this.enrollmentScheduleService.scheduleEnrollment(scheduleEnrollment)
      .subscribe(data => {
        console.log(data);
        if (data.statusCode === 200) {
          alert("Enrollment Scheduled Successfully!!");
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

