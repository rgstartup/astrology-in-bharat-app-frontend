// ============================================================
// Agent Type Definitions
// ============================================================

export type AgentStatus = "active" | "inactive" | "suspended";
export type ListingType = "astrologer" | "mandir" | "puja_shop";
export type CommissionStatus = "pending" | "paid" | "cancelled";

// ── Core Agent ───────────────────────────────────────────────
export interface Agent {
    id: number;
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

    // Bank / Payout
    bank_name?: string;
    account_number?: string;
    ifsc_code?: string;
    upi_id?: string;

    // Commission rates (%)
    commission_astrologer: number;   // % on each astrologer consultation
    commission_mandir: number;       // % on each mandir booking
    commission_puja_shop: number;    // % on each puja shop sale

    // Aggregated stats
    total_listings: number;
    total_earned: number;
    pending_payout: number;

    created_at: string;
    updated_at?: string;
}

// ── Listing linked to an Agent ───────────────────────────────
export interface AgentListing {
    id: number;
    agent_id: string;
    listing_type: ListingType;
    listing_name: string;
    listing_location?: string;
    listing_contact?: string;
    status: "active" | "inactive" | "pending";
    created_at: string;
}

// ── Commission Record ────────────────────────────────────────
export interface Commission {
    id: number;
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
