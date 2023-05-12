import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentViewComponent } from './enrollment-view/enrollment-view.component';
import { EnrollmentListComponent } from '../admin/enrollment-list/enrollment-list.component';
import { EnrollmentComponent } from './enrollment/enrollment.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    EnrollmentListComponent, 
    EnrollmentViewComponent, 
    EnrollmentComponent, 
    NavBarComponent, 
    MyprofileComponent, 
    EditProfileComponent],
  imports: [
    CommonModule
  ]
})
export class StudentModule { }

