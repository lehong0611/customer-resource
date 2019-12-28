import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GobalServicesService } from '../gobal-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private service: GobalServicesService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      Email: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      Password: ['', Validators.compose([
        Validators.required, Validators.minLength(8)
      ])],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastr.error('Email hoặc mật khẩu không chính xác!', 'Thất bại');
      return;
    }
    this.service.login(this.loginForm.value.Email, this.loginForm.value.Password).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          console.log('Logged in');
          console.log(data);
          this.router.navigate(['/quan-ly-don-hang']);
        } else {
          this.toastr.error(data.message);
          return;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

}
