import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private serverURL = environment.serverURL;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;  // Observable can be used when you want a component to reactively update when a user logs in or out.

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Can be used when you just want to get the current value of the logged in user but don't need to reactively update when it changes.
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.serverURL}/user/login`, { username, password }).pipe(map(user => {
      // Store user details and jwt token in local storage to keep user logged in between page refreshes.
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
    }));
  }

  logout(): void {
    // Remove user from local storage and set current user to null.
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
 }
}