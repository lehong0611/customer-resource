import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { GobalServicesService } from 'app/gobal-services.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export function comparePassword(c: AbstractControl) {
  const v = c.value;
  return (v.password === v.confirmPass) ? null : {
    passwordnotmatch: true
  };
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  formUpdateInfo: FormGroup;
  formChangePass: FormGroup;
  validatePhone = '(09[1-9]|03[2-9]|07[6-9]|07[0]|05[2|6|8|9]|08[1-6]|08[8|9])+([0-9]{7})';
  fileToUpload: File = null;
  userData: any;

  hideCurrentPass: boolean;
  hideNewPass: boolean;
  hideConfirmPass: boolean;

  constructor(
    private fb: FormBuilder,
    private service: GobalServicesService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.hideCurrentPass = true;
    this.hideNewPass = true;
    this.hideConfirmPass = true;

    this.formUpdateInfo = this.fb.group({
      Phone: ['', Validators.compose([
        Validators.required, Validators.pattern(this.validatePhone)
      ])],
      Address: ['', Validators.required]
    });

    this.formChangePass = this.fb.group({
      currentPass: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      newPass: this.fb.group({
        password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        confirmPass: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
      },
        { validators: comparePassword })
    });

    this.getDetailAccount();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files[0];
  }

  saveChangeInfo() {
    this.spinner.show();
    let paramUpdate = this.formUpdateInfo.value;
    if (this.fileToUpload) {
      console.log(this.fileToUpload);
      this.service.postFile(this.fileToUpload).subscribe((res: any) => {
        const imgUrl = `http://localhost:3000/uploads/${res.filename}`;
        paramUpdate.Image = imgUrl;
        if (paramUpdate.Address === this.userData.Address.name) {
          paramUpdate.Lat = this.userData.Address.lat;
          paramUpdate.lng = this.userData.Address.lng;
          this.service.updateInfo(paramUpdate).subscribe((result: any) => {
            if (result.status === 1) {
              this.getDetailAccount();
              this.formUpdateInfo.reset();
            }
          }, err => {
            console.log('Could not update')
          });
        } else {
          this.service.geocodeAddress(paramUpdate.Address).subscribe((res: any) => {
            paramUpdate.Lat = res.results[0].geometry.location.lat;
            paramUpdate.Lng = res.results[0].geometry.location.lng;
            this.service.updateInfo(paramUpdate).subscribe((result: any) => {
              if (result.status === 1) {
                this.getDetailAccount();
                this.formUpdateInfo.reset();
              }
            }, err => {
              console.log('Could not update')
            });
          });
        }
      })
    } else {
      if (paramUpdate.Address === this.userData.Address.name) {
        paramUpdate.Lat = this.userData.Address.lat;
        paramUpdate.lng = this.userData.Address.lng;
        this.service.updateInfo(paramUpdate).subscribe((result: any) => {
          this.getDetailAccount();
          this.formUpdateInfo.reset();
        }, err => {
          console.log('Could not update')
        });
      } else {
        this.service.geocodeAddress(paramUpdate.Address).subscribe((res: any) => {
          paramUpdate.Lat = res.results[0].geometry.location.lat;
          paramUpdate.Lng = res.results[0].geometry.location.lng;
          this.service.updateInfo(paramUpdate).subscribe((result: any) => {
            this.getDetailAccount();
            this.formUpdateInfo.reset();
          }, err => {
            console.log('Could not update')
          });
        });
      }
    }
  }

  getDetailAccount() {
    this.service.getDetailAccount().subscribe((res: any) => {
      this.spinner.hide();
      this.userData = res.results;
      this.formUpdateInfo.controls['Phone'].setValue(this.userData.Phone);
      this.formUpdateInfo.controls['Address'].setValue(this.userData.Address.name);
    });
  }

  changePass() {
    console.log(this.formChangePass.value);
    let currentPass = this.formChangePass.value.currentPass;
    let newPass = this.formChangePass.value.newPass.password;
    this.service.changePass(currentPass, newPass).subscribe((res: any) => {
      if (res.status === 0) {
        this.toastr.error('Đã có lỗi xảy ra !');
      } else {
        this.toastr.success('Đổi mật khẩu thành công');
        this.service.logout();
      }
      this.router.navigate(['/dang-nhap']);
    });
  }

}
