import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
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
  pageSize = 10;
  pageNr = 0;
  allUsersLoaded = false;
  checkBoxesChecked = 0;
  progress = 0;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  private getUsers() {
    this.allUsersLoaded = true; // while the call is done, hide the button
    this.callUserServicePerPageToGetUsers();
  }

  private callUserServicePerPageToGetUsers() {
    this.userService.getUsersByPage(this.pageNr, this.pageSize).subscribe({
      next: userslist => {
        if (!userslist.length || userslist.length < this.pageSize) {
          this.allUsersLoaded = true;
        } else {
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

  checkBoxClicked(value: boolean) {
    if (value) {
      this.checkBoxesChecked++;
    } else {
      this.checkBoxesChecked--;
    }

    this.calculateProgress();
  }

  calculateProgress(): void {
    this.progress = 0;
    if (this.users.length > 0) {
      this.progress = (this.checkBoxesChecked / this.users.length) * 100;
    }
  }

}

