import { ExpertProfile } from "./expert";

export interface PujaSamagriItem {
    name: string;
    quantity: string;
}

export interface ExpertPuja {
    id: string;
    expert_id: string;
    is_online: boolean;
    is_home_visit: boolean;
    name: string;
    min_duration_hours: number;
    max_duration_hours: number;
    online_cost: number;
    home_visit_with_samagri_cost: number;
    home_visit_without_samagri_cost: number;
    puja_image_url: string | null;
    description: string | null;
    districts: string[] | null;
    samagri_list: PujaSamagriItem[] | null;
    created_at: string;
    updated_at: string;
    total_likes?: number;
    expert?: ExpertProfile;
}
