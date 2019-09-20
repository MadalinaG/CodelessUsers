import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentComponent } from './services/department/department.component';
import { EditUserComponent } from './edit-user/edit-user.component'
import { UserListComponent } from './user-list/user-list.component';
const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    data: { title: 'Users' },

  }, // default route of the module
  { path: 'department', component: DepartmentComponent }, // default route of the module
  { path: 'detail/:id', component: EditUserComponent },
  { path: 'detail', component: EditUserComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
