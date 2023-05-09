import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/model/course';
import { CourseType } from 'src/app/model/course-type';
import { Department } from 'src/app/model/department';
import { Enrollment } from 'src/app/model/enrollment';
import { Semester } from 'src/app/model/semester';
import { Student } from 'src/app/model/student';
import { CourseService } from 'src/app/services/course.service';
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
  student : Student;
  constructor(private departmentService: DepartmentService,
    private courseTypeService: CoursetypeService,
    private courseService: CourseService,
    private semesterService: SemesterService,
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    private studentService: StudentService) { }

  ngOnInit() {
  //   this.departmentService.getDepartments()
  //   .subscribe((response: any) => {
  //     this.departments = response.data;
  //   });
  this.courseTypeService.getCourseTypes()
    .subscribe((response: any) => {
      this.courseTypes = response.data;
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
  
   const id= window.localStorage.getItem('id');
    this.studentService.getStudentById(Number(id)).subscribe((response: any) => {
    this.student = response.data;
    });
  }

  getSemestersByCourseType(): void {
    const courseTypeId = this.reactiveForm.get('courseType').value;
    this.semesterService.getSemesters(Number(courseTypeId)).subscribe((response: any) => {
      this.semesters = response.data;
    });
  }
  onSubmit(): void {
    this.showTable = true;
    const semId = this.reactiveForm.get('semester').value;
    
    const studentId= window.localStorage.getItem('id');
    this.enrollmentService.getEnrollmentDetailsByStudent(Number(semId),Number(studentId)).subscribe((response: any) => {
    this.enrollments = response.data;
    });
  }
}
