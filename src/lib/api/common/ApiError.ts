export interface ApiError {
  title: string;
  status: number;
  detail: string;
  instance: string;
}

export type ApiErrorForm = ApiError & FormError;

interface FormError {
  errors: { [field: string]: string[] }
}