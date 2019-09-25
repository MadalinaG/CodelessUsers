import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../user-list/user.service';
import { DepartmentService } from '../department/department.service';
import { User } from '../data/user';
import { Department } from '../data/department';
import { ListDefinition } from '../data/listDefinition';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})

export class EditUserComponent implements OnInit {

  pageTitle = 'User Edit';
  userObject: User;
  errorMessage = '';
  submitted = false;
  departments: Department[] = [];
  listDefinition: ListDefinition[] = [];
  userForm: FormGroup;
  isEditMode = false;
  currentDate = new Date();
  year = this.currentDate.getFullYear();
  month = this.currentDate.getMonth();
  day = this.currentDate.getDate();

  dropdownList: Department[] = [];
  dropdownSettings = {};

  maxDate = new Date(this.year - 18, this.month, this.day); // the user should be at least 18 years old
  minDate = new Date(this.year - 60, this.month, this.day); // the user should be young ish

  isDataLoaded: boolean;


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toast: ToastrService,
    public dialog: MatDialog) {
    this.createForm();
  }

  // naming!!
  // convenience getter for easy access to form fields
  get form() { return this.userForm.controls; }

  setDepartments(departments: Department[]): void {
    this.departments = departments;
    this.dropdownList = this.departments;

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  getData(userId) {
    forkJoin(
      this.departmentService.getDepartments(),
      this.userService.getUser(userId),
    ).subscribe(
      ([departments, userData]) => {
        this.setDepartments(departments);
        this.pageTitle = `Edit User: ${userData.name}`;
        this.userForm.setValue({
          name: userData.name,
          birthday: new Date(userData.birthday),
          selectedItems: userData.departments
        });

        this.userObject = userData;
        this.isDataLoaded = true;
      }
    );
  }

  ngOnInit() {
    // Read the product Id from the route parameter
    this.route.paramMap.subscribe(
      params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode = true;
        }
        this.getUserDetail(id);
      }
    );
  }

  getUserDetail(id: string): void {
    this.departmentService.getDepartments().subscribe(
      (departments) => {
        this.setDepartments(departments);
        this.userForm.setValue({
          name: '',
          birthday: '',
          selectedItems: '',
        });

        this.isDataLoaded = true;
      }
    );

    if (!id) {
      this.pageTitle = 'Add User';
    } else {
      this.getData(id);
    }
  }

  private createForm() {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      selectedItems: ['', [Validators.required]],
    }, {
      validator: this.MyDepartmentAgeValidator('birthday', 'selectedItems')
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }

    this.userObject.name = this.userForm.get('name').value;
    this.userObject.birthday = this.userForm.get('birthday').value;
    this.userObject.departments = this.userForm.get('selectedItems').value;

    let saveMethod = 'addUser'; // this.userService.addUser
    if (this.userObject.id) {
      saveMethod = 'updateUser';
    }

    this.userService[saveMethod](this.userObject).subscribe(response => {
      console.log('API RESPONSE', response);
      const userMessage = this.userObject.name + ' was successfully saved!';
      this.toast.success(userMessage, 'Success!');
    });

    this.goToUserList();
  }


  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }

  onBack(): void {
    this.router.navigate(['/users']);
  }

  goToUserList(): void {
    // Reset the form to clear the flags
    this.userForm.reset();
    this.router.navigate(['/users']);
  }

  deleteUser(): void {

    const data = this.createDialogMessage(this.userObject.name, this.userObject.departments[0].name);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '750px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.userObject.id === undefined) {
          // Don't delete, it was never saved.
          this.goToUserList();
        } else {
          this.userService.deleteUser(this.userObject.id)
            .subscribe({
              next: () => {
                this.goToUserList();
                this.toast.success(`${this.userObject.name} was successfully deleted!`, 'Success!');
              },
              error: err => this.errorMessage = err
            });
        }
      }
    });
  }


  private createDialogMessage(userName: string, userDepartment: string) {

    return {
      message: 'Are you sure you want to delete ' + userName + ' from department ' + userDepartment + '?',
      title: 'Delete User: ' + userName
    };
  }

  MyDepartmentAgeValidator(birthDay: string, depSelected: string) {
    return (formGroup: FormGroup) => {
      const birthDayControl = formGroup.controls[birthDay];
      const departmentControl = formGroup.controls[depSelected];

      if (Array.isArray(departmentControl.value)) {
        const depName = departmentControl.value[0].name;

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();
        const codelessRestrictionDate = new Date(year - 20, month, day);
        const codeMoreRestrictionDate = new Date(year - 24, month, day);
        if (depName === 'Codeless' && birthDayControl.value > codelessRestrictionDate) {
          birthDayControl.setErrors({ myDepartmentAgeValidatorCodeless: true });
        } else {
          if (depName === 'Codemore' && birthDayControl.value > codeMoreRestrictionDate) {
            birthDayControl.setErrors({ myDepartmentAgeValidatorCodemore: true });
          } else {
            birthDayControl.setErrors(null);
          }
        }
      }
    };
  }
}
