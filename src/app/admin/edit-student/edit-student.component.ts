import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  courseMap: Map<String, Course>;
  deptMap: Map<String, Department>;
  constructor(private studentService: StudentService, private route: ActivatedRoute,
    private toastrService: ToastrService, private departmentService: DepartmentService,
    private courseService: CourseService, private courseTypeService: CoursetypeService,
    private semesterService: SemesterService, private router: Router) { }

  ngOnInit() {
    this.studentService.getAcademicYear()
      .subscribe((response: any) => {
        this.academicYears = response.data;
      }, (err: HttpErrorResponse) => {
        if (err.status === 422) {
          this.toastrService.error("Academic Years Not Found");
        }
      });
    this.departmentService.getDepartments()
      .subscribe((response: any) => {
        this.departments = response.data;
      }, (err: HttpErrorResponse) => {
        if (err.status === 422) {
          this.toastrService.error("Departments Not Found");
        }
        this.deptMap = new Map<String, Department>();
        this.departments.forEach(department => {
          this.deptMap.set(department.name, department);
        });
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
      name: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      phno: new FormControl(null, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")),
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
    this.studentService.getStudentById(id).subscribe((response: any) => {
      this.student = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Student Not Found");
      }
    });
  }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }

  getCoursesByDepartmentAndCourseType(): void {
    const deptName:string = this.reactiveForm.get('department').value;
    let department: Department = this.deptMap.get(deptName);
    const courseTypeId:number = this.reactiveForm.get('courseType').value;
    this.courseService.getCourses(department.id, courseTypeId).subscribe((response: any) => {
      this.courses = response.data;
      this.courseMap = new Map<String, Course>();
      this.courses.forEach(course => {
        this.courseMap.set(course.name, course);
      });
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
  editStudent(): void {

    const id: number = Number(this.route.snapshot.params.id);
    this.studentService.updateStudent(id, this.student)
      .subscribe((response: any) => {
        this.student = response.data;
        if (response.statusCode === 200) {
          this.toastrService.success("Changes Saved Successfully!!")
          this.router.navigate(['/student/list']);
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
