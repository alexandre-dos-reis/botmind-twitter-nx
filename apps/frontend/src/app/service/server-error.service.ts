import { Injectable } from '@angular/core';
import { Constraints, Message, ServerError } from '@botmind-twitter-nx/api-interface';
import { capitalize1stChar } from '../helpers/stringHelpers';
import { FormErrors } from '../helpers/types';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class ServerErrorService {
  formErrors!: FormErrors;

  constructor(private messageService: MessageService) {}

  handleError(serverError: ServerError, formErrors: FormErrors): FormErrors {
    this.formErrors = formErrors;

    if (serverError.statusCode === 400) {
      return this.mapHttpErrorToFormError(serverError);
    } else {
      this.messageService.add({
        message: (serverError.message as string) + ' !',
        type: 'danger',
      });
      return this.createOrReset(this.formErrors);
    }
  }

  createOrReset(errorItems: { [key: string]: unknown }): FormErrors {
    return Object.keys(errorItems)
      .map((err) => {
        err = '';
        return err;
      })
      .reduce((acc, curr) => (acc[curr], acc), {} as FormErrors);
  }

  private mapHttpErrorToFormError(serverError: ServerError) {
    const messages = serverError.message as Message[];
    const newFormErrors = {} as FormErrors;

    messages.forEach((m) => {
      const errorsString = Object.keys(m.constraints)
        .map((key) => capitalize1stChar(m.constraints[key as keyof Constraints]))
        .join(' ');

      newFormErrors[m.property] = errorsString;
    });

    return newFormErrors;
  }
}
