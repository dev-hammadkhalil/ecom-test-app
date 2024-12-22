export const responseFunction = (
  statusCode: number,
  message: string,
  data: any = [],
) => {
  return {
    statusCode,
    message,
    data,
  };
};
