import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing';
import { NgbModule, NgbDatepickerModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentComponent } from './services/department/department.component';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSave, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserAgePipe } from './helpers/UserAgePipe';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
@NgModule({
  declarations: [DepartmentComponent, EditUserComponent, UserListComponent, UserAgePipe, ConfirmationDialogComponent],
  imports: [CommonModule,
    UsersRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    NgbDatepickerModule,
    NgMultiSelectDropDownModule.forRoot(),
    BsDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    NgbProgressbarModule,
  ],
  exports: [DepartmentComponent],
  entryComponents: [
    ConfirmationDialogComponent
  ],
})
export class UsersModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faSave, faCheckSquare);
  }

}
