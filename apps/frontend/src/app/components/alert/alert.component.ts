import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({ selector: 'app-alert', templateUrl: './alert.component.html' })
export class AlertComponent implements OnInit {
  @Input() message = '';
  @Input() type = '';
  staticAlertClosed = false;

  @ViewChild('staticAlert', { static: false }) staticAlert!: NgbAlert;

  ngOnInit(): void {
    setTimeout(() => {
      if (!this.staticAlertClosed) {
        this.staticAlert.close();
      }
    }, 5000);
  }
}
