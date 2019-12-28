import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trang-chu',
    pathMatch: 'full',
  },
  {
    path: 'trang-chu',
    loadChildren: './home/home.module#HomeModule'
  },
  {
    path: 'dang-nhap',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'dang-ky',
    loadChildren: './signup/signup.module#SignupModule'
  },
  {
    path: 'quan-ly-don-hang',
    loadChildren: './order/order.module#OrderModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'thong-tin-ca-nhan',
    loadChildren: './user-profile/user-profile.module#UserProfileModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
