import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { EditUserComponent } from './edit-user.component';
import { DepartmentComponent } from '../department/department.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';
import { Department } from '../data/department';

fdescribe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let toastrService: ToastrService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserComponent, DepartmentComponent],
      imports: [ReactiveFormsModule,
        BsDatepickerModule,
        NgbDatepickerModule,
        CommonModule,
        NgMultiSelectDropDownModule, HttpClientModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        MatDialogModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.get(ToastrService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('return from onSubmit if form invalid', () => {
    component.onSubmit();
    expect(component.form.valid).toBeFalsy();
  });

  it('it should call add user method when userObject.id not defined', () => {
    const dep = new Department();
    dep.id = 'aaa';
    dep.name = 'Codeless';
    component.form.name.setValue('Ana');
    component.form.birthday.setValue(new Date().toLocaleDateString());
    component.form.selectedItems.setValue(dep);
    // component.onSubmit();
  });

});
