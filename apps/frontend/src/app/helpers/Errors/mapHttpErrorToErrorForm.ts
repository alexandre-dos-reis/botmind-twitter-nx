import { Constraints, ServerError, Message } from '@botmind-twitter-nx/api-interface';
import { capitalize1stChar } from '../stringHelpers';
import { FormErrors } from '../types';

export const mapHttpErrorToErrorForm = (error: ServerError, errorItems: FormErrors): void => {
  const messages = error.message as Message[];
  messages.forEach((m) => {
    // Todo : remove errorItem when form is not entirely valid...
    const errorsString = Object.keys(m.constraints)
      .map((key) => capitalize1stChar(m.constraints[key as keyof Constraints]))
      .join(' ');

    errorItems[m.property] = errorsString;
  });
};
