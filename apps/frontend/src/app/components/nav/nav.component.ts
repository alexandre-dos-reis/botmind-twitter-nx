import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Emitters } from '../../emitters/emitters';
import { AuthService } from '../../service/auth.service';
import { MessageService } from '../../service/message.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      Emitters.authEmitter.subscribe((auth: boolean) => (this.isUserAuthenticated = auth))
    );
  }
  ngOnDestroy(): void {
    this.subs.map((s) => s.unsubscribe());
  }

  logout(): void {
    this.authService.logout();
    this.userService.deleteUser();
    this.isUserAuthenticated = false;
    this.messageService.add({
      message: 'Vous avez été déconnecté.',
      type: 'success',
    });
  }
}
