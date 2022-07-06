import { ServerError } from '@botmind-twitter-nx/api-interface';
import { MessageService } from '../../service/message.service';
import { FormErrors } from '../types';
import { mapHttpErrorToErrorForm } from './mapHttpErrorToErrorForm';

export const handleServerError = (
  serverError: ServerError,
  errorItems: FormErrors,
  messageService: MessageService
) => {
  if (serverError.statusCode === 400) {
    mapHttpErrorToErrorForm(serverError, errorItems);
  } else {
    messageService.add({
      message: serverError.message as string,
      type: 'danger',
    });
  }
};
