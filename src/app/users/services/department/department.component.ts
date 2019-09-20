import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {Department} from '../../data/department'
import { FormGroup, FormControl } from '@angular/forms';
import { DepartmentService } from './department.service';
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  closeResult: string;
  departmentObject : Department = new Department();

  departmentForm = new FormGroup({
    Name: new FormControl(''),
  });
  constructor(private modalService: NgbModal, private departmentService :DepartmentService) { }

  ngOnInit() {
  }
  onSave(){
    console.log(this.departmentForm.get('Name').value);
    this.departmentObject.name = this.departmentForm.get('Name').value;

    this.departmentService.addDepartment( <Department>this.departmentObject).subscribe(response => {
      console.log('API RESPONSE', response);
    })
  }
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.onSave();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
