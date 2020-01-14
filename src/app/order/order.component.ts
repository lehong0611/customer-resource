import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { GobalServicesService } from 'app/gobal-services.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  @ViewChild('addOrder', { static: true }) addOrder: TemplateRef<any>;
  @ViewChild('reasonText', { static: true }) reasonText: TemplateRef<any>;
  Order: any;
  listCustomer: any[];
  status: any;
  listTabs = [
    { key: 'created', text: 'Mới tạo' },
    { key: 'waiting', text: 'Chờ xác nhận' },
    { key: 'unavailable', text: 'Chờ lấy về đại lý' },
    { key: 'taken', text: 'Shipper đã lấy' },
    { key: 'wait-trans', text: 'Chờ giao' },
    { key: 'transfering', text: 'Đang giao' },
    { key: 'success', text: 'Hoàn thành' },
    { key: 'cancelled', text: 'Bị từ chối' },
    { key: 'failed', text: 'Giao không thành công' }
  ]
  active = false;
  listOrder: any[];
  formShipper = new FormControl();
  filteredOptions: any[];

  addForm: FormGroup;
  page: number;
  totalCount: number;
  pageSize = 8;
  search = new FormControl();
  isUpdate: boolean;
  validatePhone = '(09[1-9]|03[2-9]|07[6-9]|07[0]|05[2|6|8|9]|08[1-6]|08[8|9])+([0-9]{7})';
  initStatus: any;
  reason: string;

  listKindOfOrder = [
    { value: 0, text: 'Thời trang - Phụ kiện' },
    { value: 1, text: 'Sức khỏe - Làm đẹp' },
    { value: 2, text: 'Hàng tiêu dùng - Thực phẩm' },
    { value: 3, text: 'Phụ kiện - Thiết bị số - Thiết bị điện tử' },
    { value: 4, text: 'Hàng gia dụng - Cơ khí' },
    { value: 5, text: 'Văn phòng phẩm - Thủ công' }
  ];

  constructor(private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private service: GobalServicesService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.initStatus = 'created';
    this.changeTab('created');
    this.addForm = this.formBuilder.group({
      OrderId: [null],
      SenderName: ['', Validators.required],
      SenderPhone: ['', Validators.compose(
        [
          Validators.required,
          Validators.pattern(this.validatePhone),
          Validators.maxLength(10)
        ]
      )],
      SenderAddress: ['', Validators.required],
      ReceiverName: ['', Validators.required],
      ReceiverPhone: ['', Validators.compose(
        [
          Validators.required,
          Validators.pattern(this.validatePhone),
          Validators.maxLength(10)
        ]
      )],
      ReceiverAddress: ['', Validators.required],
      Weight: [null, Validators.required],
      Kind: ['', Validators.required],
      Cost: [null, Validators.required],
      Service: ['Chuẩn', Validators.required],
      Note: [''],
      OrderStatusName: ['']
    });
  }

  changeTab(status) {
    this.litsOrdersByStatus(status);
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

  bindKindOrder(text) {
    switch (text) {
      case 0:
        return 'Thời trang - Phụ kiện';
      case 1:
        return 'Sức khỏe - Làm đẹp';
      case 2:
        return 'Hàng tiêu dùng - Thực phẩm';
      case 3:
        return 'Phụ kiện - Thiết bị số - Thiết bị điện tử';
      case 4:
        return 'Hàng gia dụng - Cơ khí';
      default:
        return 'Văn phòng phẩm - Thủ công'
    }
  }

  onAddOrderModal(order: any) {
    this.isUpdate = false;
    if (order) {
      this.isUpdate = true;
      this.addForm.controls['OrderId'].setValue(order.OrderId);
      this.addForm.controls['SenderName'].setValue(order.SenderName);
      this.addForm.controls['SenderPhone'].setValue(order.SenderPhone);
      this.addForm.controls['SenderAddress'].setValue(order.SenderAddress);
      this.addForm.controls['ReceiverName'].setValue(order.ReceiverName);
      this.addForm.controls['ReceiverPhone'].setValue(order.ReceiverPhone);
      this.addForm.controls['ReceiverAddress'].setValue(order.ReceiverAddress);
      this.addForm.controls['Weight'].setValue(order.Weight);
      this.addForm.controls['Kind'].setValue(order.Kind);
      this.addForm.controls['Cost'].setValue(order.Cost);
      this.addForm.controls['Service'].setValue(order.Service);
      this.addForm.controls['Note'].setValue(order.Note);
      this.addForm.controls['OrderStatusName'].setValue(order.OrderStatus.name);
    } else {
      this.addForm.reset();
      this.addForm.controls['SenderName'].setValue(localStorage.getItem('full-name'));
      this.addForm.controls['SenderPhone'].setValue(localStorage.getItem('phone'));
      this.addForm.controls['SenderAddress'].setValue(localStorage.getItem('address'));
      this.addForm.controls['ReceiverName'].setValue('');
      this.addForm.controls['ReceiverPhone'].setValue('');
      this.addForm.controls['ReceiverAddress'].setValue('');
      this.addForm.controls['Weight'].setValue(null);
      this.addForm.controls['Kind'].setValue('');
      this.addForm.controls['Service'].setValue('Chuẩn');
      this.addForm.controls['Cost'].setValue(null);
      this.addForm.controls['Note'].setValue('');
    }
    this.dialog.open(this.addOrder, {
      width: '50%',
      autoFocus: true,
      disableClose: true
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  saveNewOrder() {
    // this.addForm.value.CreatedUserId = 18;
    this.addForm.value.OrderStatusName = 'created';
    this.addForm.value.OrderStatusTime = new Date();
    const newOrder = this.addForm.value;
    this.service.addNewOrder(newOrder).subscribe(res => {
      console.log(res);
      this.initStatus = 'created';
      this.changeTab('created');
      this.addForm.reset();
      this.dialog.closeAll();
    })
  }

  litsOrdersByStatus(status) {
    this.spinner.show();
    this.page = 1;
    const pagination = {
      pageCurrent: this.page,
      pageSize: this.pageSize
    }
    // const CreatedUserId = 18;
    this.service.getOrdersByStatus(status, pagination.pageCurrent, pagination.pageSize).subscribe((res: any) => {
      this.spinner.hide();
      this.listOrder = res.results.orders;
      this.totalCount = res.results.counts;
    })
  }

  pageChange(event, status) {
    console.log(event, 'is', status);
    this.spinner.show();
    this.page = event;
    const pagination = {
      pageCurrent: this.page,
      pageSize: this.pageSize
    }
    // const CreatedUserId = 18;
    this.service.getOrdersByStatus(status, pagination.pageCurrent, pagination.pageSize).subscribe((res: any) => {
      this.spinner.hide();
      this.listOrder = res.results.orders;
      console.log(this.listOrder);
    })
  }

  searchOrder() {
    const key = this.search.value;
    this.service.findOrderByCode(key).subscribe((res: any) => {
      this.initStatus = '';
      this.listOrder = res.results;
      this.search.setValue('');
    })
  }

  update() {
    const id = this.addForm.get('OrderId').value;
    this.addForm.value.OrderStatusTime = new Date();
    const updateOrder = this.addForm.value;
    this.service.updateOrder(id, updateOrder).subscribe(res => {
      this.changeTab('created');
      this.dialog.closeAll();
    })
  }

  delete(id) {
    this.service.deleteOrder(id).subscribe(res => {
      this.initStatus = 'created';
      this.changeTab('created');
    })
  }

  sendToAgency(order) {
    let listAgency = [];
    let listDistBetween = [];
    let listCalculation = [];
    let userLat = localStorage.getItem('lat');
    let userLng = localStorage.getItem('lng');
    console.log(userLat, 'user', userLng);
    this.service.getAllAgency().subscribe((res: any) => {
      listAgency = res.results;
      listAgency.forEach(agency => {
        console.log(agency);
        let dist = this.calculateTwoCoordinates(userLat, userLng, agency.brand.Address.lat, agency.brand.Address.lng);
        console.log(dist);
        listDistBetween.push({
          agencyId: agency.brand.AgencyId,
          dist: dist
        });
      });
      listCalculation = listDistBetween.map(x => {
        return x.dist;
      })
      let minDistance = Math.min(...listCalculation);
      let choseAgency = listDistBetween.find(x => {
        return x.dist === minDistance;
      });
      const updateOrder = order;
      updateOrder.OrderStatusName = 'waiting';
      updateOrder.OrderStatusTime = new Date();
      updateOrder.AdminId = choseAgency.agencyId;
      this.service.updateOrder(order.OrderId, updateOrder).subscribe((res: any) => {
        this.initStatus = 'created';
        this.changeTab('created');
      })
    })
  }

  calculateTwoCoordinates(lat1, lng1, lat2, lng2) {
    const R = 6371;
    if ((lat1 === lat2) && (lng1 === lng2)) {
      return 0;
    } else {
      let dLat = (lat1 - lat2) * Math.PI / 180;
      let dLng = (lng1 - lng2) * Math.PI / 180;
      let distance = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      let c = 2 * Math.atan2(Math.sqrt(distance), Math.sqrt(1 - distance));
      let d = Math.round(R * c * 1000);
      return d;
    }
  }

  cancelToAgency(order, status) {
    const updateOrder = order;
    updateOrder.OrderStatusName = 'created';
    updateOrder.OrderStatusTime = new Date();
    this.service.updateOrder(order.OrderId, updateOrder).subscribe((res: any) => {
      if (status === 'waiting') {
        this.initStatus = 'waiting';
        this.changeTab('waiting');
      } else {
        this.initStatus = 'unavailable';
        this.changeTab('unavailable');
      }
    })
  }

  openModalReject(reason) {
    this.reason = reason;
    this.dialog.open(this.reasonText, {
      width: '25%',
      autoFocus: true,
      disableClose: true
    });
  }
}
