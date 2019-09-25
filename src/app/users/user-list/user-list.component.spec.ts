import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../services/user.service';
import { User } from '../data/user';
import { Observable, of, throwError } from 'rxjs';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { UserAgePipe } from '../helpers/UserAgePipe';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: UserService;
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [UserListComponent, UserAgePipe],
      imports: [NgbProgressbarModule, RouterTestingModule, HttpClientModule],
      providers: [
        UserService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title as \'Users!\'', () => {
    expect(component.pageTitle).toBe('Users');
  });

  it('should have errorMessage as an empty string', () => {
    expect(component.errorMessage).toBe('');
  });

  it('should have page size equal 10', () => {
    expect(component.pageSize).toEqual(10);
  });

  it("should use the user list from the service asynchronously", () => {
    const fakedUserlist = [new User(1, "Test1", new Date(), null), new User(2, "Test2", new Date(), null)];
    spyOn(userService, 'getUsersByPage').and.returnValue(of(fakedUserlist));
    component.ngOnInit();
    expect(component.users).toEqual(fakedUserlist);
  });

  it("should have allUsersLoaded on false", () => {
    const fakedUserlist = [
      new User(1, "Test1", new Date(), null),
      new User(2, "Test2", new Date(), null),
      new User(3, "Test3", new Date(), null),
      new User(4, "Test4", new Date(), null),
      new User(5, "Test5", new Date(), null),
      new User(6, "Test6", new Date(), null),
      new User(7, "Test7", new Date(), null),
      new User(8, "Test8", new Date(), null),
      new User(9, "Test9", new Date(), null),
      new User(10, "Test10", new Date(), null),
      new User(11, "Test11", new Date(), null),
    ];
    spyOn(userService, 'getUsersByPage').and.returnValue(of(fakedUserlist));
    component.ngOnInit();
    expect(component.allUsersLoaded).toEqual(false);
    expect(component.progress).toEqual(0);
    expect(component.pageNr).toEqual(0);
    expect(component.pageSize).toEqual(10);
  });

  it("should increase the page nr and return users", () => {
    const fakedUserlist = [
      new User(1, "Test1", new Date(), null),
      new User(2, "Test2", new Date(), null),
      new User(3, "Test3", new Date(), null),
      new User(4, "Test4", new Date(), null),
      new User(5, "Test5", new Date(), null),
      new User(6, "Test6", new Date(), null),
      new User(7, "Test7", new Date(), null),
      new User(8, "Test8", new Date(), null),
      new User(9, "Test9", new Date(), null),
      new User(10, "Test10", new Date(), null),
      new User(11, "Test11", new Date(), null),
    ];
    spyOn(userService, 'getUsersByPage').and.returnValue(of(fakedUserlist));
    component.onLoadMore();
    expect(component.allUsersLoaded).toEqual(false);
    expect(component.progress).toEqual(0);
    expect(component.pageNr).toEqual(1);
    expect(component.pageSize).toEqual(10);
  });

  it("should increase the checkBoxesChecked and set progress to 10%", () => {
    const fakedUserlist = [
      new User(1, "Test1", new Date(), null),
      new User(2, "Test2", new Date(), null),
      new User(3, "Test3", new Date(), null),
      new User(4, "Test4", new Date(), null),
      new User(5, "Test5", new Date(), null),
      new User(6, "Test6", new Date(), null),
      new User(7, "Test7", new Date(), null),
      new User(8, "Test8", new Date(), null),
      new User(9, "Test9", new Date(), null),
      new User(10, "Test10", new Date(), null),
      new User(11, "Test11", new Date(), null),
    ];
    spyOn(userService, 'getUsersByPage').and.returnValue(of(fakedUserlist));
    component.ngOnInit();
    const event = Object.assign({} as Event, {
      currentTarget: {
        checked: true
      }
    });

    component.checkBox(event)

    expect(component.allUsersLoaded).toEqual(false);
    expect(component.progress).toBeGreaterThan(9);
    expect(component.checkBoxesChecked).toEqual(1);
    expect(component.pageSize).toEqual(10);
  });

  it("should increase the checkBoxesChecked and decrease it on the second call", () => {
    const fakedUserlist = [
      new User(1, "Test1", new Date(), null),
      new User(2, "Test2", new Date(), null),
      new User(3, "Test3", new Date(), null),
      new User(4, "Test4", new Date(), null),
      new User(5, "Test5", new Date(), null),
      new User(6, "Test6", new Date(), null),
      new User(7, "Test7", new Date(), null),
      new User(8, "Test8", new Date(), null),
      new User(9, "Test9", new Date(), null),
      new User(10, "Test10", new Date(), null),
      new User(11, "Test11", new Date(), null),
    ];
    spyOn(userService, 'getUsersByPage').and.returnValue(of(fakedUserlist));
    component.ngOnInit();
    const event1 = Object.assign({} as Event, {
      currentTarget: {
        checked: true
      }
    });

    const event2 = Object.assign({} as Event, {
      currentTarget: {
        checked: false
      }
    });

    component.checkBox(event1);
    component.checkBox(event2);

    expect(component.allUsersLoaded).toEqual(false);
    expect(component.progress).toEqual(0);
    expect(component.checkBoxesChecked).toEqual(0);
    expect(component.pageSize).toEqual(10);

  });

  it("should use the user list from the service asynchronously", () => {
    const fakedUserlist = [new User(1, "Test1", new Date(), null), new User(2, "Test2", new Date(), null)];
    spyOn(userService, 'getUsersByPage').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });

    component.ngOnInit();
    expect(component.errorMessage.toString()).toEqual('Error: Fake error');
  });
});
