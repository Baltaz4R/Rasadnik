import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Garden } from '../models/garden';

@Injectable({
  providedIn: 'root'
})
export class AgriculturistService {

  private serverURL = environment.serverURL;

  constructor(private http: HttpClient) { }

  getGardens() {
    return this.http.get<any>(`${this.serverURL}/agriculturist/getAll`);
  }

  getGarden(id: String) {
    return this.http.get<any>(`${this.serverURL}/agriculturist/get/${id}`);
  }

  getComment(id: String) {
    return this.http.get<any>(`${this.serverURL}/agriculturist/store/comment/get/${id}`);
  }

  isOrdered(id: String) {
    return this.http.get<any>(`${this.serverURL}/agriculturist/store/comment/bought/${id}`);
  }

  isCommented(id) {
    return this.http.get<any>(`${this.serverURL}/agriculturist/store/comment/is/${id}`);
  }

  getStore() {
    return this.http.get<any>(`${this.serverURL}/agriculturist/store/getAll`);
  }

  getWarehouse(id: String) {
    return this.http.get<any>(`${this.serverURL}/agriculturist/warehouse/get/${id}`);
  }

  getProduct(id: String) {
    return this.http.get<any>(`${this.serverURL}/agriculturist/store/product/get/${id}`);
  }

  addGarden(garden: Garden) {
    return this.http.post<any>(`${this.serverURL}/agriculturist/add`, garden);
  }

  order(store, orders, garden) {
    return this.http.post<any>(`${this.serverURL}/agriculturist/store/addOrders`, { store, orders, garden });
  }

  addTree(id: String, i: Number, j: Number, tree) {
    return this.http.put<any>(`${this.serverURL}/agriculturist/garden/put/${id}`, { i, j, tree });
  }

  addComment(id, text) {
    return this.http.put<any>(`${this.serverURL}/agriculturist/store/comment/${id}`, { text });
  }

  addPreparation(id: String, i: Number, j: Number, preparation) {
    return this.http.put<any>(`${this.serverURL}/agriculturist/garden/preparation/${id}`, { i, j, preparation });
  }

  removeTree(id: String, i: Number, j: Number) {
    return this.http.post<any>(`${this.serverURL}/agriculturist/garden/remove/${id}`, { i, j });
  }

  incTank(id: String) {
    return this.http.get<any>(`${this.serverURL}/agriculturist/garden/tank/inc/${id}`);
  }

  decTank(id: String) {
    return this.http.get<any>(`${this.serverURL}/agriculturist/garden/tank/dec/${id}`);
  }

  incTemperature(id: String) {
    return this.http.get<any>(`${this.serverURL}/agriculturist/garden/temperature/inc/${id}`);
  }

  decTemperature(id: String) {
    return this.http.get<any>(`${this.serverURL}/agriculturist/garden/temperature/dec/${id}`);
  }

  cancle(id: String, garden) {
    return this.http.post<any>(`${this.serverURL}/agriculturist/warehouse/cancle/${id}`, { id: garden });
  }

}