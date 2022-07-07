import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ServerError,
  SignInDtoRequest,
  UserProfileResponse,
} from '@botmind-twitter-nx/api-interface';
import { Emitters } from '../../emitters/emitters';
import { handleServerError } from '../../helpers/Errors/handleServerError';
import { createErrorItems } from '../../helpers/Form';
import { FormErrors } from '../../helpers/types';
import { AuthService } from '../../service/auth.service';
import { JwtService } from '../../service/jwt.service';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './signin.component.html',
})
export class SigninComponent implements OnInit {
  form!: FormGroup;
  errors!: FormErrors;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    const formItems = {
      email: '',
      password: '',
    };

    this.form = this.formBuilder.group({
      ...formItems,
    } as SignInDtoRequest);

    this.errors = createErrorItems(formItems);
  }

  onSubmit(): void {
    this.authService.signIn(this.form.getRawValue() as SignInDtoRequest).subscribe({
      // on success
      next: (res) => {
        this.jwtService.setToken(res);
        this.authService.getUserProfile().subscribe((res: UserProfileResponse) => {
          this.authService.currentUser = res;
          this.messageService.add({
            message: `Bonjour ${this.authService.currentUser.firstname} ${this.authService.currentUser.lastname}, vous êtes connecté.`,
            type: 'success',
          });
          Emitters.authEmitter.emit(true);
          this.router.navigate(['/']);
        });
      },
      // on error
      error: ({ error }: { error: ServerError }) => {
        Emitters.authEmitter.emit(false);
        handleServerError(error, this.errors, this.messageService);
      },
    });
  }
}
