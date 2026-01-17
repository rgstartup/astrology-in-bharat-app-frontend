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

export interface ProfileData {
    name: string;
    bio: string;
    specialization: string[];
    experience: string;
    languages: string[];
    availability: string;
    certificates: string[];
    bankDetails: string;
    profilePic: string;
    isProfileActive: boolean;
    kycCompleted: boolean;
}
