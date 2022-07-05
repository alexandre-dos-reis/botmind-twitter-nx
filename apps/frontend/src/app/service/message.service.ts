import { Injectable } from '@angular/core';

interface Alert {
  type: 'success' | 'info' | 'warning' | 'danger';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  alerts: Alert[] = [];

  add(alert: Alert) {
    this.alerts.push(alert);
  }

  clear() {
    this.alerts = [];
  }
}
