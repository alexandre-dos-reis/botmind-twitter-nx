import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({ selector: 'app-alert', templateUrl: './alert.component.html' })
export class AlertComponent implements OnInit {
  private subject = new Subject<string>();

  @Input() message = '';
  @Input() type = '';

  @ViewChild('staticAlert', { static: false }) staticAlert!: NgbAlert;

  ngOnInit(): void {
    setTimeout(() => this.staticAlert.close(), 5000);
  }
}
