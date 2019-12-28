import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GobalServicesService } from 'app/gobal-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  registerForm: FormGroup;
  validatePhone = '(09[1-9]|03[2-9]|07[6-9]|07[0]|05[2|6|8|9]|08[1-6]|08[8|9])+([0-9]{7})';

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private service: GobalServicesService,
    private router: Router) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      Email: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      Password: ['', Validators.compose([
        Validators.required, Validators.minLength(8)
      ])],
      FullName: ['', Validators.required],
      Phone: ['', Validators.compose([
        Validators.required, Validators.pattern(this.validatePhone)
      ])],
      Address: ['', Validators.required]
    });
  }

  onSubmit() {
    let params = this.registerForm;
    if (params.invalid) {
      this.toastr.error('Vui lòng nhập chính xác các trường!', 'Thất bại');
      return;
    }
    this.service.geocodeAddress(params.get('Address').value).subscribe((res: any) => {
      params.value.Lat = res.results[0].geometry.location.lat;
      params.value.Lng = res.results[0].geometry.location.lng;

      this.service.register(params.value).subscribe(
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
    })
}

}
