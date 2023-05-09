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
//declare var window: any;
@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})

export class EnrollmentComponent implements OnInit {
  // selectedSubject:string ;
  // selectedValue: Enrolls[] = [];
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
 // isDisabled = false;
  // formModal:any;
 
  //enrolls: {staffName: string, subjectName: string, subjectCode: string}[] = [];
  showTable: boolean = false;
  subject: Subject;
  isCheck:boolean=false;
  
  staffSubjectMap: Map<Number, Staff[]>;
  // disabled :boolean =false;
  // isDisabled: boolean = true; 
  // selectedValue: string;
  //  public optionsFormArray = new FormArray([]);

  // subject: any;
  // subject = new FormControl([]);

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
    // this.formModal = new window.bootstrap.Modal(document.getElementById("warningModal"));
    // this.formModal.show();
  }
  // this.subjects.forEach(option => {
  //   const optionFormControl = new FormControl(false);
  //   this.optionsFormArray.push(optionFormControl);
  // });

  // this.reactiveForm = this.formBuilder.group({
  //   selectedValue: ''
  // });
  // this.reactiveForm.value();

  // isSelected(id: number) {
  //   return this.subject.value.includes(id);
  // }
  getCheckSchedule(studentId:number){
    this.studentService.checkSchedule(Number(studentId)).subscribe((response :any)=>{
     this.isCheck=response.data;
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
      // this.staffSubjectMap = new Map<Number,Staff[]>();
      // this.staffSubjectMap.set(Number(subjectId),this.staffs);
      this.staffs.forEach(staff => {
        this.staffMap.set(staff.id, staff)
      });
    });
  }
  // isSubjectSelected(subjectName: string): boolean {
  //   return this.selectedSubjects.indexOf(subjectName) !== -1;
  // }
  addStaff(): void {
    this.showTable = true;
    const subjectId = this.reactiveForm.get('subject').value;
    //  const studentId=this.student.id;
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
        // let staff :Staff;
        // console.log(staff);
        // let staffs : Staff[] = this.staffSubjectMap.get(Number(subjectId));
        // console.log(staffs);

        // for(let i=0;i<staffs.length;i++){
        //   console.log(staffs[i].id," ",Number(staffId))
        //   if(staffs[i].id === Number(staffId)){
        //     staff = staffs[i];
        //     console.log(staff)

        //   }
        // }

        const studentId = window.localStorage.getItem('id');
        let filterValue = new FilterValues();
        filterValue.staffName = staff.name;
        filterValue.subjectName = subject.name;
        filterValue.subjectCode = subject.code;
        filterValue.subjectId = subject.id;
        filterValue.studentId = Number(studentId);
        filterValue.staffId = staff.id;

        if(this.enrolls == null || this.enrolls.length<=0){
          this.enrolls.push(filterValue);
        } else {
          let enrolledSubject = this.enrolls.find(enroll => enroll.subjectCode === filterValue.subjectCode);
          if(enrolledSubject != null){
            this.enrolls.forEach(e => {
              if(e.subjectCode === filterValue.subjectCode && e.staffId !== filterValue.staffId){
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
  // public selectAllValues(event) {
  //   const selectAll = event.target.checked;
  //   this.optionsFormArray.controls.forEach(control => {
  //     control.setValue(selectAll);
  //   });
  // }
  // public areAllValuesSelected() {
  //   return this.optionsFormArray.controls.every(control => control.value === true);
  // }

  // isOptionDisabled(value: number): boolean {
  //   return this.reactiveForm.get('subject').value === value;
  // }
  // onSubjectSelect() {
  //   const selectedSubject = this.subjects.find(subject => subject.name === this.selectedSubject);
  //   this.disabled = true;
  //   this.selectedSubjects.push(this.selectedSubject);
  // 
  // }
  onSubmit(): void {
    if(this.enrolls.length>=5){
    for (let i = 0; i < this.enrolls.length; i++) {
      let enroll: Enrolls = this.enrolls[i];
      const values = { subjectId: enroll.subjectId, studentId: enroll.studentId, staffId: enroll.staffId };
      //this.enrolls.push(value);
      // if(subjectId==enroll.subjectId)
      // {
      //   alert("hi");
      // }
      // else{
      this.finalEnrollments.push(values);
      //  }
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
      // this.router.navigate(['/enrollment-student-list', studentId]);
    });
  }
  else{
    alert("Select all the subjects");
  }
    // this.enrollmentService.getEnrollment(this.finalEnrollments).subscribe((response: any) => {
    //   this.enrollments = response.data;
    //   if (response.statusCode === 200) {
    //     // this.enrollment(this.student.id);
    //     alert("Enrollment Successful !!!")
    //     this.router.navigate(['/enrollment-student-list']);
    //   }
    // }, (err: HttpErrorResponse) => {
    //   if (err.status === 422 && err.error.message === "Invalid Student Id or Subject Id or Staff Id") {
    //     alert("Invalid Student Id or Subject Id or Staff Id");
    //   }
    //   // this.router.navigate(['/enrollment-student-list', studentId]);
    // });
  }
}
  // enrollment(id:number): void {
  //   this.router.navigate(['/enrollment-student-list', id]);
  // }

