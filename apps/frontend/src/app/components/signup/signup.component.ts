import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SignUpDtoRequest, Error400, Constraints } from '@botmind-twitter-nx/api-interface';
import { AuthService } from '../../service/auth.service';
import { MessageService } from '../../service/message.service';

interface ErrorItems {
  [key: string]: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  form!: FormGroup;
  errors!: ErrorItems;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    } as SignUpDtoRequest);

    this.errors = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    };
  }

  submit(): void {
    this.authService.signUp(this.form.getRawValue() as SignUpDtoRequest).subscribe({
      // On success
      next: () => {
        this.messageService.add({
          type: 'success',
          message: 'OK',
        });
        this.form.reset();
      },
      // On error
      error: ({ error }: { error: Error400 }) => {
        error.message.forEach((m) => {
          const errorsString = Object.keys(m.constraints)
            .map((key) => {
              const errorString = m.constraints[key as keyof Constraints];
              return errorString.charAt(0).toUpperCase() + errorString.slice(1) + ' !';
            })
            .join(' ');
          this.errors[m.property as keyof SignUpDtoRequest] = errorsString;
        });
      },
    });
  }
}
