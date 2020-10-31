import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private serverURL = environment.serverURL

  constructor(private http: HttpClient) { }

  register(user: User) {
      return this.http.post(`${this.serverURL}/user/register`, user);
  }

  change(old, password) {
    return this.http.post(`${this.serverURL}/user/change`, { old, password });
  }

  getRequests() {
    return this.http.get(`${this.serverURL}/user/getRequests`);
  }

  cancle(id: String) {
    return this.http.delete<any>(`${this.serverURL}/user/cancle/${id}`);
  }

  accept(id: String) {
    return this.http.get<any>(`${this.serverURL}/user/accept/${id}`);
  }

  getAgriculturists() {
    return this.http.get(`${this.serverURL}/user/getAgriculturists`);
  }

  getEnterprises() {
    return this.http.get(`${this.serverURL}/user/getEnterprises`);
  }

  deleteAgriculturists(id) {
    return this.http.delete(`${this.serverURL}/user/deleteAgriculturists/${id}`);
  }

  deleteEnterprises(id) {
    return this.http.delete(`${this.serverURL}/user/deleteEnterprises/${id}`);
  }

  changeAgriculturists(agriculturist) {
    return this.http.post(`${this.serverURL}/user/changeAgriculturists`, { agriculturist });
  }

  changeEnterprises(enterprise) {
    return this.http.post(`${this.serverURL}/user/changeEnterprises`, { enterprise });
  }

}
