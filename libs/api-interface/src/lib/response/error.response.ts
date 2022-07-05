interface Target {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

interface Constraints {
    isEmail: string;
    isNotEmpty: string;
}

interface Message {
    target: Target;
    value: string;
    property: string;
    children: any[];
    constraints: Constraints;
}

export interface Error400 {
    statusCode: number;
    message: Message[];
    error: string;
}