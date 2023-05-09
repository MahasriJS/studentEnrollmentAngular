import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddStudentComponent } from './add-student/add-student.component';
import { StudentListComponent } from './student-list/student-list.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { AddSubjectComponent } from './add-subject/add-subject.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { EditStaffComponent } from './edit-staff/edit-staff.component';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { StaffAssignComponent } from './staff-assign/staff-assign.component';
import { StaffAssignListComponent } from './staff-assign-list/staff-assign-list.component';
import { EnrollmentListComponent } from './enrollment-list/enrollment-list.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { EnrollmentScheduleComponent } from './enrollment-schedule/enrollment-schedule.component';

@NgModule({
  declarations: [
    AddStudentComponent, 
    StudentListComponent, 
    EditStudentComponent, 
    AddSubjectComponent, 
    AddStaffComponent, 
    StaffListComponent, 
    EditStaffComponent, 
    SubjectListComponent, 
    StaffAssignComponent, StaffAssignListComponent, EnrollmentListComponent, AdminLoginComponent, UpgradeComponent, EnrollmentScheduleComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class AdminModule {

 }
