interface Target {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface Constraints {
  isEmail: string;
  isNotEmpty: string;
}

export interface Message {
  target: Target;
  value: string;
  property: string;
  children: any[];
  constraints: Constraints;
}

export interface ServerError {
  statusCode: number;
  message: string | Message[];
  error: string;
}
