// ============================================================
// Agent Type Definitions
// ============================================================

export type AgentStatus = "active" | "inactive" | "suspended";
export type ListingType = "expert" | "mandir" | "puja_shop";
export type CommissionStatus = "pending" | "paid" | "cancelled";

// ── Core Agent ───────────────────────────────────────────────
export interface Agent {
    id: string;
    agent_id: string;           // e.g. AGT-0001
    name: string;
    email: string;
    phone: string;
    status: AgentStatus;
    avatar?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    aadhaar_no?: string;
    pan_no?: string;

    // Bank / Payout
    bank_name?: string;
    account_number?: string;
    ifsc_code?: string;
    upi_id?: string;

    // Commission rates (%)
    commission_expert?: number;   // % on each expert consultation
    commission_mandir?: number;       // % on each mandir booking
    commission_puja_shop?: number;    // % on each puja shop sale
    commission_rate?: number;         // Flat rate from backend

    // Aggregated stats
    total_listings: number;
    total_earned: number;
    pending_payout: number;

    created_at: string;
    updated_at?: string;
}

// ── Listing linked to an Agent ───────────────────────────────
export interface AgentListing {
    id: string;
    agent_id: string;
    listing_type: ListingType;
    listing_name: string;
    listing_location?: string;
    status: "approved" | "inactive" | "pending" | "rejected";
    name?: string;           // Standardized name field
    location?: string;       // Standardized location field
    phone?: string;          // Standardized phone field
    agent_code?: string;     // Standardized agent code
    agent_name?: string;     // Standardized agent name
    deity?: string;          // mandir
    specialization?: string; // expert
    items?: string;          // puja_shop
    
    // Merchant Verification Fields
    isVerified?: boolean;
    gstin?: string;
    pan?: string;
    isGstExempt?: boolean;
    bankName?: string;
    accountHolder?: string;
    accountNumber?: string;
    ifsc?: string;
    gstCertificate?: string;
    panFront?: string;
    panBack?: string;
    aadharFront?: string;
    aadharBack?: string;
    fullDetails?: {
        pan?: string;
        accountNumber?: string;
    };
    
    created_at: string;
}

// ── Commission Record ────────────────────────────────────────
export interface Commission {
    id: string;
    agent_id: string;
    agent_name: string;
    listing_type: ListingType;
    listing_name: string;
    amount: number;
    status: CommissionStatus;
    created_at: string;
}

// ── Stats (returned from API or computed client-side) ────────
export interface AgentStats {
    totalAgents: number;
    activeAgents: number;
    totalListings: number;
    pendingPayouts: number;
}
