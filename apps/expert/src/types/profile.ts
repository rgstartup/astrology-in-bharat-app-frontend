export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    created_at?: Date | string;
    createdAt?: Date | string;
}

export interface LeaveDate {
    id: string;
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
    pincode?: string;
    houseNo?: string;
    tag?: string;
}

export interface ExperienceItem {
    id: string;
    title?: string;
    organization?: string;
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
    isCurrent: boolean;
    location?: string;
}

export interface SamagriItem {
    name: string;
    quantity: string;
}

export interface PujaService {
    id?: string;
    is_online: boolean;
    is_home_visit: boolean;
    name: string;
    min_duration_hours: number;
    max_duration_hours: number;
    online_cost?: number;
    home_visit_with_samagri_cost?: number;
    home_visit_without_samagri_cost?: number;
    description: string;
    districts?: string[];
    samagri_list: SamagriItem[];
    puja_image_url?: string;
}

export interface CustomService {
    id: string;
    name: string;
    price: number;
    unit: string;
    description?: string;
}

export interface DocumentItem {
    id: string;
    name: string;
    type: string;
    size?: string;
    url: string;
    uploadedAt?: Date;
    category?: 'aadhar' | 'pan' | 'other';
    side?: 'front' | 'back';
}

export interface Profile {
    name: string;
    email: string;
    gender: Gender;
    specialization: string;
    bio?: string;
    about?: string;
    experience_in_years: number;
    date_of_birth?: string;
    languages: string[];
    price: number;
    chat_price?: number;
    call_price?: number;
    video_call_price?: number;
    report_price?: number;
    horoscope_price?: number;
    bank_details: string;
    is_available: boolean;
    profilePic?: string;
    kycStatus?: string;
    kycCompleted: boolean;
    addresses: Address[];
    phoneNumber?: string;
    houseNo?: string;
    state?: string;
    district?: string;
    country?: string;
    pincode?: string;
    certificates?: string[];
    gallery: string[];
    videos: string[];
    video?: string;
    detailed_experience: ExperienceItem[];
    custom_services?: CustomService[];
    pujas?: PujaService[];
    documents?: DocumentItem[];
}
