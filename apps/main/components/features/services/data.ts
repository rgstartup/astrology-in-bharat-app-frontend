import homepageData from "../../../public/data/homepage.json";

export interface ServiceData {
    id: number;
    image: string;
    title: string;
    description: string;
    price?: number;
    longDescription?: string;
    slug: string;
    benefits?: string[];
    process?: string[];
    faq?: { question: string; answer: string }[];
}

export const AstrologyServicesData: ServiceData[] = homepageData.astrologyServices as any;

export interface ConsultationData {
    id: number;
    image: string;
    title: string;
    price?: number;
    longDescription?: string;
    slug: string;
    description?: string;
    benefits?: string[];
    process?: string[];
    faq?: { question: string; answer: string }[];
}

export const ConsultationServicesData: ConsultationData[] = homepageData.consultationServices as any;


