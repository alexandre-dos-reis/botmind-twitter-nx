import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({ selector: 'app-alert', templateUrl: './alert.component.html' })
export class AlertComponent implements OnInit, OnDestroy {
  @Input() message = '';
  @Input() type = '';
  staticAlertClosed = false;
  timeout!: NodeJS.Timeout;

  @ViewChild('staticAlert', { static: false }) staticAlert!: NgbAlert;

  ngOnInit(): void {
    this.timeout = setTimeout(() => {
      if (!this.staticAlertClosed) {
        this.staticAlert.close();
      }
    }, 5000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }
}
