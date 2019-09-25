import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { DepartmentComponent } from '../services/department/department.component';
import { DepartmentService } from '../services/department/department.service';
import { User } from '../data/user';
import { Department } from '../data/department';
import { ListDefinition } from '../data/listDefinition';
import { MyDepartmentAgeValidator } from '../helpers/userValidation';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [DepartmentComponent]
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

  maxDate = new Date(this.year - 18, this.month, this.day) // the user should be at least 18 years old
  minDate = new Date(this.year - 60, this.month, this.day) // the user should be young ish

  isDataLoaded: boolean;


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private departmentComponent: DepartmentComponent,
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toast: ToastrService,
    public dialog: MatDialog) {
    this.createForm();
  }

  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }

  openDepartmentModalOnClick(content) {
    this.departmentComponent.open(content);
  }

  setDepartments(departments): void {


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
        console.log(departments, userData)
        this.setDepartments(departments);
        this.pageTitle = `Edit User: ${userData.name}`;
        this.userForm.setValue({
          name: userData.name,
          birthday: new Date(userData.birthday),
          selectedItems: userData.departments
        })

        this.userObject = userData;
        this.isDataLoaded = true;
      }
    )
  }

  ngOnInit() {
    // Read the product Id from the route parameter
    this.route.paramMap.subscribe(
      params => {
        const id = params.get('id') || 0;
        if (id != 0) {
          this.isEditMode = true;
        }
        console.log(id);
        this.getUserDetail(id);
      }
    );

    console.log("Edit mode:", this.isEditMode);
    console.log("User id:", this.userObject.id);
  }

  getUserDetail(id): void {
    this.departmentService.getDepartments().subscribe(
      (departments) => {
        this.setDepartments(departments);
        this.userForm.setValue({
          name: '',
          birthday: '',
          selectedItems: '',
        })

        this.isDataLoaded = true;
      }
    )

    if (id == 0) {
      this.pageTitle = 'Add User';
    }
    else {
      this.getData(id);
    }
  }


  private createForm() {
    this.userForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      birthday: new FormControl('', Validators.required),
      selectedItems: new FormControl('', Validators.required)
    }, {
      validator: MyDepartmentAgeValidator('birthday', 'selectedItems')
    });

    this.userForm.valueChanges.subscribe(data => {
      //console.log(this.userForm);
    })
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

    if (this.userObject.id === undefined) {
      this.userService.addUser(this.userObject).subscribe(response => {
        console.log('API RESPONSE', response);

      })
    } else {
      this.userService.updateUser(this.userObject).subscribe(response => {
        console.log('API RESPONSE', response);
      })
    }
    var userMessage = this.userObject.name + " was successfully saved!";
    this.toast.success(userMessage, "Success!");
    this.onSaveComplete();
  }

  dropdownList = [];
  dropdownSettings = {};

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

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.userForm.reset();
    this.router.navigate(['/users']);
  }

  deleteUser(): void {

    var data = this.createDialogMessage(this.userObject.name, this.userObject.departments[0].name);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '750px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        if (this.userObject.id === undefined) {
          // Don't delete, it was never saved.
          console.log("Don't delete, it was never saved.");
          this.onSaveComplete();
        } else {
          this.userService.deleteUser(this.userObject.id)
            .subscribe({
              next: () => {
                this.onSaveComplete();
                var userMessage = this.userObject.name + " was successfully deleted!";
                this.toast.success(userMessage, "Success!");
              },
              error: err => this.errorMessage = err
            });
        }
      }
    });
  }


  private createDialogMessage(userName: string, userDepartment: string) {

    return {
      message: "Are you sure you want to delete " + userName + " from department " + userDepartment + "?",
      title: "Delete User: " + userName
    };
  }
}
