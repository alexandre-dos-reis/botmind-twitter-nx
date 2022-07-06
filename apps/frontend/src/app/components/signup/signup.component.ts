import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServerError, SignUpDtoRequest } from '@botmind-twitter-nx/api-interface';
import { emptyErrorForm } from '../../helpers/Errors';
import { handleServerError } from '../../helpers/Errors/handleServerError';
import { createErrorItems } from '../../helpers/Form';
import { FormErrors } from '../../helpers/types';
import { AuthService } from '../../service/auth.service';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  form!: FormGroup;
  errors!: FormErrors;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
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

    this.errors = createErrorItems(formItems);
  }

  onSubmit(): void {
    this.authService.signUp(this.form.getRawValue() as SignUpDtoRequest).subscribe({
      // on success
      next: () => {
        this.messageService.add({
          type: 'success',
          message: 'Votre compte a été créé.',
        });
        this.form.reset();
        this.errors = emptyErrorForm(this.errors);
      },
      // on error
      error: ({ error }: { error: ServerError }) => {
        handleServerError(error, this.errors, this.messageService);
      },
    });
  }
}
