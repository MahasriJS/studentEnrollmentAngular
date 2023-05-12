import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Enrollment } from 'src/app/model/enrollment';
import { EnrollmentDto } from 'src/app/model/enrollmentDto';
import { Enroll } from 'src/app/model/enroll';
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
  enrolls: Enroll[] = [];
  finalEnrollments: EnrollmentDto[] = [];

  showTable: boolean = false;
  subject: Subject;
  isCheck: boolean = false;

  staffSubjectMap: Map<Number, Staff[]>;


  constructor(private studentService: StudentService, private route: ActivatedRoute,
    private subjectService: SubjectService, private staffService: StaffService,
    private enrollmentService: EnrollmentService, private formBuilder: FormBuilder,
    private router: Router, private toastrService: ToastrService) { }
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
    this.checkSchedule(Number(window.localStorage.getItem('studentId')));
    this.getStudentById();
  }

  checkSchedule(studentId: number) {
    this.studentService.checkSchedule(Number(studentId)).subscribe((response: any) => {
      this.isCheck = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Enrollment Schedule Not Found");
      }
    });
  }
  getStudentById() {
    const id: number = Number(window.localStorage.getItem('studentId'));
    this.studentService.getStudentById(id).subscribe((response: any) => {
      this.student = response.data;
      if (this.student != null) {
        this.getSubjectsByCourseAndSemester();
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Student Not Found");
      }
    });
  }
  getSubjectsByCourseAndSemester(): void {
    this.subjectService.getSubjects(this.student.course.id, this.student.semester.id).subscribe((response: any) => {
      this.subjects = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Subjects Not Found");
      }
      this.subjectMap = new Map<number, Subject>();
      this.subjects.forEach(subject => {
        this.subjectMap.set(subject.id, subject);
      });
    });
  }

  getStaffsBySubjectId(): void {
    const subjectId: number = Number(this.reactiveForm.get('subject').value);
    this.staffService.getAssignedStaffBySubjectId(subjectId).subscribe((response: any) => {
      this.staffs = response.data;
    }, (err: HttpErrorResponse) => {
      if (err.status === 422) {
        this.toastrService.error("Staff Not Found");
      }
      this.staffMap = new Map<number, Staff>();
      this.staffs.forEach(staff => {
        this.staffMap.set(staff.id, staff)
      });
    });
  }

  addStaff(): void {
    this.showTable = true;
    const subjectId: number = Number(this.reactiveForm.get('subject').value);
    const studentId: number = Number(window.localStorage.getItem('studentId'));
    const staffId: number = Number(this.reactiveForm.get('staff').value);
    this.enrollmentService.getEnrollmentAvailability(subjectId, studentId,
      staffId, this.student.semester.id, this.student.department.id, this.student.course.id).subscribe((response: any) => {
        this.enrollments = response.data;
        let subject: Subject = this.subjectMap.get(Number(subjectId));
        let staff: Staff = this.staffMap.get(Number(staffId));
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
          this.toastrService.error("You have already enrolled");
        }
        if (err.status === 422 && err.error.data === false) {
          this.toastrService.error("Enrollment is Not available for this staff");
        }
      });
  }

  saveEnrollment(): void {
    if (this.enrolls.length >= 5) {
      for (let i = 0; i < this.enrolls.length; i++) {
        let enroll: Enroll = this.enrolls[i];
        let filterValue = new FilterValues();
        filterValue.subjectId = enroll.subjectId;
        filterValue.studentId = enroll.studentId;
        filterValue.staffId = enroll.staffId;
        this.finalEnrollments.push(filterValue);
      }
      this.enrollmentService.saveEnrollment(this.finalEnrollments).subscribe((response: any) => {
        this.enrollments = response.data;
        if (response.statusCode === 200) {
          this.toastrService.success("Enrollment Successful !!!")
          this.router.navigate(['/enrollment-student-list']);
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 422 && err.error.message === "Student is already enrolled in this subject") {
          this.toastrService.error("You have already enrolled");
        }
        if (err.status === 422 && err.error.message === "Invalid Student Id or Subject Id or Staff Id") {
          this.toastrService.error("Invalid Student Id or Subject Id or Staff Id");
        }
      });
    }
    else {
      this.toastrService.error("Select all the subjects");
    }
  }
}
