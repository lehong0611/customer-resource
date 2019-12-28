import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GobalServicesService } from 'app/gobal-services.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/quan-ly-don-hang', title: 'Quản lý đơn hàng', icon: 'local_shipping', class: '' },
  { path: '/thong-tin-ca-nhan', title: 'Thông tin cá nhân', icon: 'person', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  userData: any;

  constructor(private router: Router, private service: GobalServicesService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.getInforLogin();
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  getInforLogin() {
    this.service.getDetailAccount().subscribe((res: any) => {
      this.userData = res.results;
      localStorage.setItem('loginName', this.userData.FullName);
      localStorage.setItem('loginPhone', this.userData.Phone);
      // localStorage.setItem('loginAddress', this.userData.Address.name);
      // localStorage.setItem('loginEmail', this.userData.Email);
      // localStorage.setItem('loginImage', this.userData.Image);
    },
      (err) => {
        console.log(err);
        // this.errorMessage = err.
      });
  }

  logOut() {
    this.service.logout();
    this.router.navigate(['/trang-chu']);
  }
}
