import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from '../../emitters/emitters';
import { AuthService } from '../../service/auth.service';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  isUserAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.isUserAuthenticated = auth;
    });
  }

  logout(): void {
    this.authService.logout();
    this.isUserAuthenticated = false;
    this.messageService.add({
      message: 'Vous avez été déconnecté.',
      type: 'success',
    });
  }
}
