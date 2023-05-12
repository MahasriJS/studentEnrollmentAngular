import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AddStudentComponent } from './admin/add-student/add-student.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './student/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { StudentListComponent } from './admin/student-list/student-list.component';
import { EditStudentComponent } from './admin/edit-student/edit-student.component';
import { AddSubjectComponent } from './admin/add-subject/add-subject.component';
import { AddStaffComponent } from './admin/add-staff/add-staff.component';
import { StaffListComponent } from './admin/staff-list/staff-list.component';
import { EditStaffComponent } from './admin/edit-staff/edit-staff.component';
import { SubjectListComponent } from './admin/subject-list/subject-list.component';
import { StaffAssignComponent } from './admin/staff-assign/staff-assign.component';
import { StaffAssignListComponent } from './admin/staff-assign-list/staff-assign-list.component';
import { EnrollmentListComponent } from './admin/enrollment-list/enrollment-list.component';
import { EnrollmentViewComponent } from './student/enrollment-view/enrollment-view.component';
import { ChangePasswordComponent } from './student/change-password/change-password.component';
import { EnrollmentComponent } from './student/enrollment/enrollment.component';
import { NavbarComponent } from './admin/navbar/navbar.component';
import { HomeComponent } from './admin/home/home.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { NavBarComponent } from './student/nav-bar/nav-bar.component';
import { MyprofileComponent } from './student/myprofile/myprofile.component';
import { EditProfileComponent } from './student/edit-profile/edit-profile.component';
import { UpgradeComponent } from './admin/upgrade/upgrade.component';
import { ToastrModule } from 'ngx-toastr';
import { EnrollmentScheduleComponent } from './admin/enrollment-schedule/enrollment-schedule.component';
import { UrlUtils } from './utils/url-utils';


const appRoutes: Routes = [
  { path: '', redirectTo: "student/login", pathMatch: "full" },
  { path: 'student/login', component: LoginComponent },
  { path: 'student/add', component: AddStudentComponent },
  { path: 'student/list', component: StudentListComponent },
  { path: 'student/:id/edit', component: EditStudentComponent },
  { path:'subject/add', component:AddSubjectComponent},
  { path:'staff/add',component:AddStaffComponent },
  { path: 'staff/list', component:StaffListComponent},
  { path: 'staff/:id/edit', component: EditStaffComponent },
  { path: 'subject/list',component:SubjectListComponent},
  { path:'staff/assign', component:StaffAssignComponent},
  { path: 'staff/assign/list',component:StaffAssignListComponent},
  { path: 'enrollment/list/admin', component:EnrollmentListComponent},
  { path:'enrollment/list/student', component:EnrollmentViewComponent},
  { path: 'student/change-password', component:ChangePasswordComponent},
  { path:'student/enrollment', component:EnrollmentComponent},
  { path:'home', component:HomeComponent},
  { path:'admin/login', component:AdminLoginComponent},
  { path:'my-profile', component:MyprofileComponent},
  { path:'edit-profile',component:EditProfileComponent},
  { path:'student/upgrade', component: UpgradeComponent},
  { path:'enrollment/schedule', component:EnrollmentScheduleComponent},
  { path: "**", component: LoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AddStudentComponent,
    LoginComponent,
    StudentListComponent,
    EditStudentComponent,
    AddSubjectComponent,
    AddStaffComponent,
    StaffListComponent,
    EditStaffComponent,
    SubjectListComponent,
   StaffAssignComponent,
   StaffAssignListComponent, 
   EnrollmentListComponent,
   EnrollmentViewComponent,
   ChangePasswordComponent,
   EnrollmentComponent,
   NavbarComponent,
   HomeComponent,
   AdminLoginComponent,
   NavBarComponent,
   MyprofileComponent,
   EditProfileComponent,
   UpgradeComponent,
   EnrollmentScheduleComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
    timeOut: 3000, // 15 seconds
    closeButton: true,
    progressBar: true,
    }),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [UrlUtils],
  bootstrap: [AppComponent]
})
export class AppModule { }