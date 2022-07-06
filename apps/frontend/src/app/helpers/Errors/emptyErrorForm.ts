import { FormErrors } from '../types';

export const emptyErrorForm = (errorItems: FormErrors) => {
  return Object.keys(errorItems)
    .map((err) => {
      err = '';
      return err;
    })
    .reduce((acc, curr) => (acc[curr], acc), {} as { [key: string]: string });
};
