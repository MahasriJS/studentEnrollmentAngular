import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  reactiveForm: FormGroup;
  student: Student;
  departments: Department[];
  courses: Course[];
  academicYears: string[];
  courseTypes: CourseType[];
  semesters: Semester[];
  constructor(private studentService: StudentService, private route: ActivatedRoute,
    private toastrService: ToastrService, private departmentService: DepartmentService,
    private courseService: CourseService, private courseTypeService: CoursetypeService,
    private semesterService: SemesterService) { }

  ngOnInit() {
    this.studentService.getAcademicYear()
      .subscribe((response: any) => {
        this.academicYears = response.data;
      });
    this.departmentService.getDepartments()
      .subscribe((response: any) => {
        this.departments = response.data;
      });
    this.courseTypeService.getCourseTypes()
      .subscribe((response: any) => {
        this.courseTypes = response.data;
      });
    this.reactiveForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      phno: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      dateOfJoining: new FormControl(null, Validators.required),
      academicYear: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      courseType: new FormControl(null, Validators.required),
      semester: new FormControl(null, Validators.required)
    });
    this.getStudentById();
  }
  getStudentById() {
    const id: number = Number(this.route.snapshot.params.id);
    this.studentService.getStudentById(Number(id)).subscribe((response: any) => {
      this.student = response.data;
      console.log(this.student.name);
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
  onSubmit(): void {
    console.log(this.student.name);
    console.log(this.reactiveForm);
    const id: number = Number(this.route.snapshot.params.id);
    //const student = this.reactiveForm.value;
    this.studentService.updateStudent(id, this.student)
      .subscribe((response: any) => {
        this.student = response.data;
        if (response.statusCode === 200) {
          alert("Student Updated Successfully!!")
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 422 && err.error.message === "Email is already exists.") {
          alert("Email is already exists.");
          
        }
        if (err.status === 422 && err.error.message === "Phno is already exists.") {
          alert("Phno is already exists.");
          
        }
        if (err.status === 422 && err.error.message === "Check  email or phone Pattern") {
          alert("Check email or phone Pattern");
        }
      });

  }
}
