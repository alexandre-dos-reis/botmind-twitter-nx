export const createErrorItems = (errorItems: { [key: string]: string }) => {
  return Object.keys(errorItems)
    .map((err) => {
      err = '';
      return err;
    })
    .reduce((acc, curr) => (acc[curr], acc), {} as { [key: string]: string });
};
