import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GobalServicesService {

  baseUrl = 'http://localhost:3000/api';

  urLGetOrder = 'http://localhost:3000/api/order/getAllOrderByStatus';

  urlMap = 'https://maps.googleapis.com/maps/api/geocode/json'

  key = 'AIzaSyDBg3nDKzFPiRaZXMgFhN63qSWWZK1vVTc'

  isLoggedIn = false;
  token: any;

  constructor(private http: HttpClient) { }

  addNewOrder(params) {
    return this.http.post(`${this.baseUrl}/order/createOrder`, params);
  }

  getOrdersByStatus(status, pageNum, pageSize) {
    return this.http.get(`${this.urLGetOrder}?OrderStatus=${status}&page=${pageNum}&pageSize=${pageSize}`);
  }

  findOrderByCode(id) {
    return this.http.get(`${this.baseUrl}/order/getOrderInfoById/${id}`);
  }

  updateOrder(id, order) {
    return this.http.put(`${this.baseUrl}/order/updateOrderById/${id}`, order);
  }

  deleteOrder(id) {
    return this.http.delete(`${this.baseUrl}/order/deleteOrderById/${id}`);
  }

  getAllAgency() {
    return this.http.get(`${this.baseUrl}/branch/agencys`);
  }

  login(email, password) {
    return this.http.post(`${this.baseUrl}/customer/login`, { Email: email, Password: password })
      .pipe(
        tap((res: any) => {
          if (res.status === 0) {
            return res;
          } else {
            localStorage.setItem('token-customer', res.results.token);
            localStorage.setItem('full-name', res.results.fullName);
            localStorage.setItem('phone', res.results.phone);
            localStorage.setItem('address', res.results.address.name);
            localStorage.setItem('lat', res.results.address.lat);
            localStorage.setItem('lng', res.results.address.lng);
            this.token = res.results;
            this.isLoggedIn = true;
            return true;
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token-customer');
    this.isLoggedIn = false;
    delete this.token;
  }

  getToken() {
    this.token = localStorage.getItem('token-customer');
    if (this.token != null) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  geocodeAddress(loc: string) {
    let headers = new HttpHeaders();
    headers.append('no-token', 'true');
    return this.http.get(`${this.urlMap}?address=${loc}&key=${this.key}`, {headers: headers});
  }

  register(params) {
    return this.http.post(`${this.baseUrl}/customer/register`, params)
      .pipe(
        tap((res: any) => {
          if (res.status === 0) {
            return res;
          } else {
            localStorage.setItem('token-customer', res.results.token);
            localStorage.setItem('full-name', res.results.fullName);
            localStorage.setItem('phone', res.results.phone);
            localStorage.setItem('address', res.results.address.name);
            localStorage.setItem('lat', res.results.address.lat);
            localStorage.setItem('lng', res.results.address.lng);
            this.token = res.results;
            this.isLoggedIn = true;
            return true;
          }
        })
    );
  }

  getDetailAccount() {
    return this.http.get(`${this.baseUrl}/customer/customerDetail`);
  }

  postFile(fileToUpload: File) {
    let headers = new HttpHeaders();
    headers.append('no-token', 'true');
    const endpoint = `${this.baseUrl}/upload`;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post(endpoint, formData, {headers: headers});
  }

  updateInfo(param) {
    return this.http.put(`${this.baseUrl}/customer/updateInfo`, param);
  }

  changePass(currentPass, newPass) {
    return this.http.put(`${this.baseUrl}/customer/changePassword`, { currentPass, newPass });
  }

}
