import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  private serverURL = environment.serverURL;

  constructor(private http: HttpClient) { }

  getOrders() {
    return this.http.get<any>(`${this.serverURL}/enterprise/orders/getAll`);
  }

  getStore() {
    return this.http.get<any>(`${this.serverURL}/enterprise/store/getAll/`);
  }

  getStatistics() {
    return this.http.get<any>(`${this.serverURL}/enterprise/orders/statistics`);
  }

  cancle(id: String, order) {
    return this.http.post<any>(`${this.serverURL}/enterprise/orders/cancle/${id}`, { order });
  }

  accept(id: String, order) {
    return this.http.post<any>(`${this.serverURL}/enterprise/orders/accept/${id}`, { order });
  }

  deliver(id: String, order) {
    return this.http.post<any>(`${this.serverURL}/enterprise/orders/deliver/${id}`, { order });
  }

  delete(id) {
    return this.http.delete(`${this.serverURL}/enterprise/store/delete/${id}`);
  }
  
  addProduct(product) {
    return this.http.post<any>(`${this.serverURL}/enterprise/store/add`, product);
  }

}
