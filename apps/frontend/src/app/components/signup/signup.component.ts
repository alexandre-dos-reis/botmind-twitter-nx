import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerError, SignUpDtoRequest } from '@botmind-twitter-nx/api-interface';
import { Subscription } from 'rxjs';
import { FormErrors } from '../../helpers/types';
import { AuthService } from '../../service/auth.service';
import { MessageService } from '../../service/message.service';
import { ServerErrorService } from '../../service/server-error.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit, OnDestroy {
  form!: UntypedFormGroup;
  errors!: FormErrors;
  subs: Subscription[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private serverErrorService: ServerErrorService
  ) {}

  ngOnInit(): void {
    const formItems = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    };

    this.form = this.formBuilder.group({
      ...formItems,
    } as SignUpDtoRequest);

    this.errors = this.serverErrorService.createOrReset(formItems);
  }

  ngOnDestroy(): void {
    this.subs.map((s) => s.unsubscribe());
  }

  onSubmit(): void {
    this.subs.push(
      this.authService.signUp(this.form.getRawValue() as SignUpDtoRequest).subscribe({
        next: () => {
          this.messageService.add({
            type: 'success',
            message: 'Votre compte a été créé.',
          });
          this.form.reset();
          this.errors = this.serverErrorService.createOrReset(this.errors);
          this.router.navigate(['se-connecter']);
        },
        error: ({ error }: { error: ServerError }) => {
          this.errors = this.serverErrorService.handleError(error, this.errors);
        },
      })
    );
  }
}