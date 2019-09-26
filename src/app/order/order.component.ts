import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { GobalServicesService } from 'app/gobal-services.service';
import { NgxSpinnerService } from 'ngx-spinner';

declare const $: any;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  @ViewChild('detailOrder', { static: true }) detailOrder: TemplateRef<any>;
  @ViewChild('reject', { static: true }) reject: TemplateRef<any>;
  @ViewChild('addOrder', { static: true }) addOrder: TemplateRef<any>;

  // start fake data
  listWaitingAccept: any[];
  listWaitingTake: any[];
  listNewOrders: any[];
  listAssigning: any[];
  listAssigned: any[];
  listTransferOrders: any[];
  listSuccessOrders: any[];
  listFailOrders: any[];
  listReTransferOrders: any[];
  // end fake data
  isUserSupper: true;
  Order: any;
  listCustomer: any[];
  isReject: any;
  status: any;
  listTabs = [
    {key: 'created', text: 'Mới tạo'},
    {key: 'waiting', text: 'Chờ xác nhận'},
    {key: 'unavailable', text: 'Chờ lấy'},
    {key: 'taken', text: 'Shipper đã lấy'},
    {key: 'transfering', text: 'Đang giao'},
    {key: 'success', text: 'Thành công'},
    {key: 'failed', text: 'Thất bại'},
    {key: 'return', text: 'Chờ trả lại'},
    {key: 'cancelled', text: 'Đã hủy'}
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

  constructor(private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private service: GobalServicesService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      OrderId: [null],
      SenderName: ['', Validators.required],
      SenderPhone: ['', Validators.required],
      SenderAddress: ['', Validators.required],
      ReceiverName: ['', Validators.required],
      ReceiverPhone: ['', Validators.required],
      ReceiverAddress: ['', Validators.required],
      Weight: [null, Validators.required],
      Kind: ['', Validators.required],
      Cost: [null, Validators.required],
      Service: ['Chuẩn', Validators.required],
      Note: [''],
      OrderStatusName: ['']
    });
    this.changeTab('created');
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.listCustomer.filter(option => option['fullname'].toLowerCase().indexOf(filterValue) === 0);
  }

  accept(order: any) {
    this.Order = order;
    this.isReject = false;
    this.dialog.open(this.detailOrder, {
      width: '60%',
      autoFocus: true,
      disableClose: true
    });
  }

  rejectOrder() {
    console.log('hihi');
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
        return 'Thành công';
      case 'failed':
        return 'Thất bại';
      case 'return':
        return 'Chờ trả lại';
      case 'cancelled':
        return 'Đã hủy';
    }
  }

  onDetailOrder(order) {
    this.Order = order;
    this.formShipper.valueChanges.subscribe((res: any) => {
      this.filteredOptions = this._filter(res);
      console.log(this.filteredOptions);
    });
    this.dialog.open(this.detailOrder, {
      width: '80%',
      autoFocus: true,
      disableClose: true
    });
  }

  openModalReject() {
    this.dialog.open(this.reject, {
      width: '30%',
      autoFocus: true,
    });
  }

  onAddOrderModal(order: any) {
    this.isUpdate = false;
    if (order) {
      console.log(order);
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
      this.addForm.controls['SenderName'].setValue('');
      this.addForm.controls['SenderPhone'].setValue('');
      this.addForm.controls['SenderAddress'].setValue('');
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
    this.addForm.value.CreatedUserId = 0;
    this.addForm.value.OrderStatus = 'created'
    const newOrder = this.addForm.value;
    this.service.addNewOrder(newOrder).subscribe(res => {
      console.log(res);
      this.changeTab('created');
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
    const CreatedUserId = 0;
    this.service.getOrdersByStatus(status, CreatedUserId, pagination.pageCurrent, pagination.pageSize).subscribe((res: any) => {
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
    const CreatedUserId = 0;
    this.service.getOrdersByStatus(status, CreatedUserId, pagination.pageCurrent, pagination.pageSize).subscribe((res: any) => {
      this.spinner.hide();
      this.listOrder = res.results.orders;
    })
  }

  // bindCodeOrder(text): string {
  //   const code = text.substr(0, 11);
  //   return code;
  // }

  searchOrder() {
    const key = this.search.value;
    this.service.findOrderByCode(key).subscribe((res: any) => {
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
      this.changeTab('created');
    })
  }

  sendToAgency(){}
}
