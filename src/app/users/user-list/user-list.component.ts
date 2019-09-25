import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../data/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  pageTitle = 'Users';
  users: User[] = [];
  errorMessage = '';
  pageSize: number = 10;
  pageNr: number = 0;
  allUsersLoaded: boolean = false;
  checkBoxesChecked: number = 0;
  progress: number = 0;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }


  private getUsers() {

    this.allUsersLoaded = true; //while the call is done, hide the button
    this.callUserServicePerPageToGetUsers();
  }

  private callUserServicePerPageToGetUsers() {
    this.userService.getUsersByPage(this.pageNr, this.pageSize).subscribe({
      next: userslist => {
        if (userslist.length < 1 || userslist.length < this.pageSize) {
          this.allUsersLoaded = true;
        }
        else {
          this.allUsersLoaded = false;
        }
        this.users.push(...userslist);
        this.calculateProgress();
      },
      error: err => this.errorMessage = err
    });
  }

  onLoadMore() {
    this.pageNr = this.pageNr + 1;
    this.getUsers();
  }

  checkBox(event: any) {
    console.log(event.currentTarget.checked);
    if (event.currentTarget.checked) {
      this.checkBoxesChecked++;
    }
    else {
      this.checkBoxesChecked--;
      if (this.checkBoxesChecked == 0) {
        this.progress = 0;
      }
    }

    this.calculateProgress();
  }

  calculateProgress(): void {
    if (this.users.length > 0 && this.checkBoxesChecked > 0) {
      this.progress = (this.checkBoxesChecked / this.users.length) * 100;
    }
  }

}

