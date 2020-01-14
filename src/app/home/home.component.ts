import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { GobalServicesService } from 'app/gobal-services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('inforOrder', { static: true }) inforOrder: TemplateRef<any>;
  keySearch: FormControl;
  listOrder: any[];
  order: any;

  constructor(private dialog: MatDialog,
              private orderService: GobalServicesService,
              private toastr: ToastrService ) { }

  ngOnInit() {
    this.keySearch = new FormControl();
  }

  showInforOrder() {
    if (!this.keySearch.value) {
      this.toastr.error('Vui lòng nhập mã đơn hàng để tra cứu!');
      return;
    }
    const key = this.keySearch.value;
    this.orderService.findOrderByCode(key).subscribe((res: any) => {
      this.listOrder = res.results;
      this.order = this.listOrder[0];
      // this.keySearch.setValue('');
      this.dialog.open(this.inforOrder, {
        width: '50%',
        autoFocus: true,
        disableClose: true
      });
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  bindingTextStatus(text) {
    switch (text) {
      case 'created':
        return 'Mới tạo';
      case 'waiting':
        return 'Chờ xác nhận';
      case 'unavailable':
        return 'Chờ lấy';
      case 'taken':
        return 'Shipper đã lấy';
      case 'transfering':
        return 'Đang giao';
      case 'success':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Bị từ chối';
      case 'failed':
        return 'Giao không thành công'
    }
  }

}
