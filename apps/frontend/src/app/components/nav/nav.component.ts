import { Component, OnInit } from '@angular/core';
import { Emitters } from '../../emitters/emitters';
import { AuthService } from '../../service/auth.service';
import { MessageService } from '../../service/message.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  isUserAuthenticated = false;

  constructor(private authService: AuthService, private messageService: MessageService, private userService: UserService) {
    Emitters.authEmitter.subscribe((auth: boolean) => (this.isUserAuthenticated = auth));
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    this.userService.deleteUser()
    this.isUserAuthenticated = false;
    this.messageService.add({
      message: 'Vous avez été déconnecté.',
      type: 'success',
    });
  }
}
