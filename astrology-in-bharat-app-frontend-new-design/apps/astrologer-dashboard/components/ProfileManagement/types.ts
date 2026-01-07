export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: Date;
}

export interface LeaveDate {
    id: number;
    date: string;
    reason: string;
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export interface Address {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    tag?: string;
}

export interface Profile {
    name: string;
    email: string;
    gender: Gender;
    specialization: string;
    bio?: string;
    experience_in_years: number;
    date_of_birth?: string;
    languages: string[];
    price: number;
    bank_details: string;
    is_available: boolean;
    profilePic?: string;
    kycCompleted: boolean;
    addresses: Address[];
    certificates?: string[];
}
