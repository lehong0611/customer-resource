import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GobalServicesService {

  baseUrl = 'http://localhost:3000/api';

  urLGetOrder = 'http://localhost:3000/api/order/getAllOrderByStatus'

  constructor(private http: HttpClient) { }

  addNewOrder(params) {
    return this.http.post(`${this.baseUrl}/order/createOrder`, params);
  }

  getOrdersByStatus(status, createdId, pageNum, pageSize) {
    return this.http.get(`${this.urLGetOrder}?OrderStatus=${status}&CreatedUserId=${createdId}&page=${pageNum}&pageSize=${pageSize}`);
  }

  findOrderByCode(id) {
    return this.http.get(`${this.baseUrl}/order/findOrder?_id=${id}`);
  }

  updateOrder(id, order) {
    return this.http.put(`${this.baseUrl}/order/updateOrderById/${id}`, order);
  }

  deleteOrder(id) {
    return this.http.delete(`${this.baseUrl}/order/deleteOrderById/${id}`);
  }

}
