import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Enrollment } from 'src/app/model/enrollment';
import { Enrollments } from 'src/app/model/enrollments';
import { Enrolls } from 'src/app/model/enrolls';
import { FilterValues } from 'src/app/model/filter-values';
import { Staff } from 'src/app/model/staff';
import { Student } from 'src/app/model/student';
import { Subject } from 'src/app/model/subject';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { StaffService } from 'src/app/services/staff.service';
import { StudentService } from 'src/app/services/student.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})

export class EnrollmentComponent implements OnInit {
  reactiveForm: FormGroup;
  student: Student;
  subjects: Subject[];
  staffs: Staff[];
  enrollments: Enrollment[] = [];
  subjectMap: Map<number, Subject>;
  staffMap: Map<number, Staff>;
  selectedSubjects: string[] = [];
  enrolls: Enrolls[] = [];
  finalEnrollments: Enrollments[] = [];

  showTable: boolean = false;
  subject: Subject;
  isCheck: boolean = false;

  staffSubjectMap: Map<Number, Staff[]>;


  constructor(private studentService: StudentService, private route: ActivatedRoute,
    private subjectService: SubjectService, private staffService: StaffService,
    private enrollmentService: EnrollmentService, private formBuilder: FormBuilder,
    private router: Router) { }
  ngOnInit() {
    this.reactiveForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      courseType: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      semester: new FormControl(null, Validators.required),
      subject: new FormControl(null, Validators.required),
      staff: new FormControl(null, Validators.required)
    });
    this.getCheckSchedule(Number(window.localStorage.getItem('id')));
    this.getStudentById();
  }

  getCheckSchedule(studentId: number) {
    this.studentService.checkSchedule(Number(studentId)).subscribe((response: any) => {
      this.isCheck = response.data;
    });
  }
  getStudentById() {
    const id = window.localStorage.getItem('id');
    this.studentService.getStudentById(Number(id)).subscribe((response: any) => {
      this.student = response.data;
      if (this.student != null) {
        this.getSubjectByCourseAndSemester();
      }
    });
  }
  getSubjectByCourseAndSemester(): void {
    const courseId = this.student.course.id;
    const semId = this.student.semester.id;
    this.subjectService.getSubjects(Number(courseId), Number(semId)).subscribe((response: any) => {
      this.subjects = response.data;
      // this.getStaffsBySubject();
      //  this.isDisabled = true;
      this.subjectMap = new Map<number, Subject>();
      this.subjects.forEach(subject => {
        this.subjectMap.set(subject.id, subject);
      });
    });
  }

  getStaffsBySubject(): void {
    const subjectId = this.reactiveForm.get('subject').value;
    this.staffService.getAssignedStaff(Number(subjectId)).subscribe((response: any) => {
      this.staffs = response.data;
      this.staffMap = new Map<number, Staff>();
      this.staffs.forEach(staff => {
        this.staffMap.set(staff.id, staff)
      });
    });
  }

  addStaff(): void {
    this.showTable = true;
    const subjectId = this.reactiveForm.get('subject').value;
    const studentId = window.localStorage.getItem('id');
    const semId = this.student.semester.id;
    const staffId = this.reactiveForm.get('staff').value;
    const courseId = this.student.course.id;
    const deptId = this.student.department.id;
    this.enrollmentService.getEnrollmentAvailability(Number(subjectId), Number(studentId),
      staffId, Number(semId), Number(deptId), Number(courseId)).subscribe((response: any) => {
        console.log(response.data)
        this.enrollments = response.data;
        let subject: Subject = this.subjectMap.get(Number(subjectId));
        console.log(this.staffMap);
        let staff: Staff = this.staffMap.get(Number(staffId));
        const studentId = window.localStorage.getItem('id');
        let filterValue = new FilterValues();
        filterValue.staffName = staff.name;
        filterValue.subjectName = subject.name;
        filterValue.subjectCode = subject.code;
        filterValue.subjectId = subject.id;
        filterValue.studentId = Number(studentId);
        filterValue.staffId = staff.id;

        if (this.enrolls == null || this.enrolls.length <= 0) {
          this.enrolls.push(filterValue);
        } else {
          let enrolledSubject = this.enrolls.find(enroll => enroll.subjectCode === filterValue.subjectCode);
          if (enrolledSubject != null) {
            this.enrolls.forEach(e => {
              if (e.subjectCode === filterValue.subjectCode && e.staffId !== filterValue.staffId) {
                e.staffId = filterValue.staffId;
                e.staffName = filterValue.staffName;
              }
            });
          } else {
            this.enrolls.push(filterValue);
          }
        }
        this.staffMap.clear();

      }, (err: HttpErrorResponse) => {
        if (err.status === 422 && err.error.message === "Student is already enrolled in this subject") {
          alert("You have already enrolled");
        }
        if (err.status === 422 && err.error.data === false) {
          alert("Enrollment is full for this staff");
        }
        if (err.status === 422) {
          alert("Please enter the required values");
        }
      });
  }

  onSubmit(): void {
    if (this.enrolls.length >= 5) {
      for (let i = 0; i < this.enrolls.length; i++) {
        let enroll: Enrolls = this.enrolls[i];
        const values = { subjectId: enroll.subjectId, studentId: enroll.studentId, staffId: enroll.staffId };
        this.finalEnrollments.push(values);
      }
      this.enrollmentService.getEnrollment(this.finalEnrollments).subscribe((response: any) => {
        this.enrollments = response.data;
        if (response.statusCode === 200) {
          // this.enrollment(this.student.id);
          alert("Enrollment Successful !!!")
          this.router.navigate(['/enrollment-student-list']);
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 422 && err.error.message === "Student is already enrolled in this subject") {
          alert("You have already enrolled");
        }
        if (err.status === 422 && err.error.message === "Invalid Student Id or Subject Id or Staff Id") {
          alert("Invalid Student Id or Subject Id or Staff Id");
        }
      });
    }
    else {
      alert("Select all the subjects");
    }
  }
}
