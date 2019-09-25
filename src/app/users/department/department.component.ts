import { Component, OnInit, ElementRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { DepartmentService } from './department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  closeResult: string;
  modalRef: NgbModalRef;
  departmentForm = new FormGroup({
    name: new FormControl(''),
  });

  constructor(private modalService: NgbModal, private departmentService: DepartmentService) { }

  ngOnInit() { }

  onSave() {
    console.log(this.departmentForm.value);
    this.departmentService.addDepartment(this.departmentForm.value).subscribe(response => {
      console.log('API RESPONSE', response);
      this.modalRef.close();
    });
  }

  openModal(content: ElementRef) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

}
