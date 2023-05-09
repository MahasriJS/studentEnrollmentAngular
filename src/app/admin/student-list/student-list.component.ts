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
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  reactiveForm: FormGroup;
  students: Student[];
  student: Student;
  departments: Department[];
  courses: Course[];
  semesters: Semester[];
  courseTypes: CourseType[];
  showTable = false;
  academicYears:string[];
  // isAlert:boolean=false;
  // message:string;
  constructor(private departmentService: DepartmentService,
    private courseTypeService: CoursetypeService,
    private courseService: CourseService,
    private semesterService: SemesterService,
    private studentService: StudentService, private router: Router, private toastrService:ToastrService) { }

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
      department: new FormControl(null, Validators.required),
      courseType: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      semester: new FormControl(null, Validators.required),
      academicYear: new FormControl(null,Validators.required)
    });

  }
  getCoursesByDepartmentAndCourseType(deptId: number, courseTypeId: number): void {
    this.courseService.getCourses(Number(deptId), Number(courseTypeId)).subscribe((response: any) => {
      this.courses = response.data;
    });

  }

  // getSemestersByCourseType(courseTypeId: number): void {
  //   this.semesterService.getSemesters(Number(courseTypeId)).subscribe((response: any) => {
  //     this.semesters = response.data;
  //   });
  // }
  get reactiveFormControl() {
    return this.reactiveForm.controls;
  }
  onSubmit(): void {
   
    const deptId = this.reactiveForm.get('department').value;
    const courseId = this.reactiveForm.get('course').value;
    const academicYear=this.reactiveForm.get('academicYear').value;
    this.studentService.getStudents(Number(deptId), Number(courseId), academicYear).subscribe((response: any) => {
    this.students = response.data;
  
      if (response.statusCode === 200){
        this.showTable = true;
        this.toastrService.success("Student Display Successfully");
      }
      if (response.statusCode === 200 && response.message==="Students Not Found") {
        this.toastrService.warning("No Data Found")
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422 && err.error.message==="Invalid Department Id or Course Id or Semester Id") {
        this.toastrService.error("Please enter the required values");
        // window.location.reload();
      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/student', id, 'edit']);
  }
  upgrade(student:Student){
    this.router.navigate(['/upgrade']);
  }

  // upgrade(student:Student){
  //   const courseTypeId = this.reactiveForm.get('courseType').value;
  //   const semId = this.reactiveForm.get('semester').value;
  //   if(courseTypeId==1 && semId<8 || courseTypeId==2 && semId<12){
  //   this.studentService.upgrade(Number(student.id)).subscribe((response: any) => {
  //     this.student = response.data;
  //     if (response.statusCode === 200) {
  //     alert("Student Upgrade Successfully!!");
  //     // this.isAlert=true;
  //     // this.message="Student Upgrade Successfully!!"
  //     }
  //   const index:number = this.students.indexOf(student);
  //   if (index >= 0) {
  //     this.students.splice(index, 1);
  //   }
  //   }, (err: HttpErrorResponse) => {
  //     if (err.status === 422) {
  //       alert("Unable to upgrade student"); 
  //     }
  //   });
  // }
  // else{
  //   alert("Unable to upgrade student");
  // }
  // }
  updateAvailability(student: Student) {
    const isAvailable = !student.isAvailable;
    this.studentService.updateStudentAvailability(Number(student.id), isAvailable).subscribe((response: any) => {
      this.student = response.data;
      if (response.statusCode === 200) {
        student.isAvailable = isAvailable;
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        alert("Please enter the required values");
        window.location.reload();
      }
    });
  }
}