import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  reactiveForm: FormGroup;
  departments: Department[];
  courseTypes: CourseType[];
  courses: Course[];
  semesters: Semester[];
  academicYears: string[];
  

  constructor(private departmentService: DepartmentService, private studentService: StudentService,
    private courseTypeService: CoursetypeService, private courseService: CourseService, private fb: FormBuilder,
    private semesterService: SemesterService, private router: Router, private toastrService: ToastrService) {
  }


  ngOnInit() {
    this.studentService.getAcademicYear()
      .subscribe((response: any) => {
        this.academicYears = response.data;
      }, (err: HttpErrorResponse) => {
        if (err.status === 422) {
          this.toastrService.error("Acadmic Year Not Found");
        }
      });
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
      name: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      courseType: new FormControl(''),
      semester: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      phno: new FormControl(null,  Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")),
      dob: new FormControl(null, Validators.required),
      academicYear: new FormControl(null, Validators.required),
      dateofjoining: new FormControl(null, Validators.required)
     
    });


}
  get reactiveFormControl() {
    return this.reactiveForm.controls;
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

  addStudent(): void {
    const student: Student = {
      name: this.reactiveForm.value.name,
      email: this.reactiveForm.value.email,
      address: this.reactiveForm.value.address,
      phno: this.reactiveForm.value.phno,
      dob: this.reactiveForm.value.dob,
      dateOfJoining: this.reactiveForm.value.dateofjoining,
      isAvailable: true,
      academicYear: this.reactiveForm.get('academicYear').value,
      deptId: this.reactiveForm.get('department').value,
      courseId: this.reactiveForm.get('course').value,
      semId: this.reactiveForm.get('semester').value,
      type: "Student"
    };

    this.studentService.addStudent(student)
      .subscribe(data => {
        if (data.statusCode === 200) {
          this.toastrService.success("Student Added Successfully!!")
          this.router.navigate(['/student/list']);
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 422 && err.error.message === "Phone Number already exists.") {
          this.toastrService.warning("Phone Number is already exists");
        }
        if (err.status === 422 && err.error.message === "Email address is already exists.") {
          this.toastrService.warning("Email address is already exists");
        }
        if (err.status === 422 && err.error.message === "Invaild phoneNumber") {
          this.toastrService.warning("Invaild phoneNumber");
        }
        if (err.status === 422 && err.error.message === "Invaild email") {
          this.toastrService.warning("Invaild email");
        }
        
        if (err.status === 422 && err.error.message === "Invalid Department Id or Course Id or Semester Id") {
          this.toastrService.error("Invalid Department Id or Course Id or Semester Id");
        }
        if (err.status === 422 && err.error.message === "Invaild email") {
          this.toastrService.error("Check email Pattern domainname@gmail.com");
        }
        if (err.status === 422 && err.error.message === "Invaild phoneNumber") {
          this.toastrService.error("Phone length must be 10 characters");
        }
      });
  }
}



