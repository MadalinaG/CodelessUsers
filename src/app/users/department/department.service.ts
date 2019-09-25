import { Injectable } from '@angular/core';
import { MessageService } from 'src/app/message.service';
import { Observable, of } from 'rxjs';
import { Department } from '../data/department';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';

const endpoint = '/api/department';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  /** GET departments from the server */
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(endpoint)
      .pipe(
        tap(_ => this.log('fetched departments')),
        catchError(this.handleError<Department[]>('getDepartments', []))
      );
  }

  addDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(endpoint, department, httpOptions).pipe(
      tap((departmentResponse) => this.log(`added department w/ id=${departmentResponse}`)),
      catchError(this.handleError<any>('addDepartment'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`DepartmentService: ${message}`);
  }
}
