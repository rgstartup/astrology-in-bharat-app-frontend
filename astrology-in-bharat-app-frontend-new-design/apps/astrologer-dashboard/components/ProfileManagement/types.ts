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
    gallery: string[];
    videos: string[];
    detailed_experience: ExperienceItem[];
}

export interface ExperienceItem {
    id: number;
    title?: string; // Kept for backward compatibility if needed, but not primary
    organization?: string;
    role: string;
    company: string;
    startDate: string;
    endDate: string; // or 'Present'
    description: string;
    isCurrent: boolean;
}

export interface DocumentItem {
    id: number;
    name: string;
    type: string;
    size: string;
    url?: string;
    uploadedAt: Date;
}
