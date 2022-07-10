import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ServerError,
  SignInDtoRequest,
  UserProfileResponse,
} from '@botmind-twitter-nx/api-interface';
import { Subscription } from 'rxjs';
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
export class SigninComponent implements OnInit, OnDestroy {
  form!: UntypedFormGroup;
  errors!: FormErrors;
  subs: Subscription[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
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

  ngOnDestroy(): void {
    this.subs.map((s) => s.unsubscribe());
  }

  onSubmit(): void {
    this.subs.push(
      this.authService.signIn(this.form.getRawValue() as SignInDtoRequest).subscribe({
        // on success
        next: (res) => {
          this.jwtService.setToken(res);
          this.authService.getUserProfile().subscribe((res: UserProfileResponse) => {
            this.authService.currentUser = res;
            Emitters.authEmitter.emit(true);
            this.router.navigate(['/']);
            this.messageService.add({
              message: `Bonjour ${this.authService.currentUser.firstname} ${this.authService.currentUser.lastname}, vous êtes connecté.`,
              type: 'success',
            });
          });
        },
        // on error
        error: ({ error }: { error: ServerError }) => {
          Emitters.authEmitter.emit(false);
          handleServerError(error, this.errors, this.messageService);
        },
      })
    );
  }
}
