import type { Agent } from "./agent";

/**
 * Builds the ProfileModal-compatible props for a given Agent.
 * ProfileModal requires: name (not title), isOpen, onClose, details.
 * We use `checklist` to display all agent info rows in the modal.
 */
export const getAgentProfileModalProps = (agent: Agent) => ({
    // ── Required by ProfileModal ───────────────────────────────
    name: agent.name,
    subtitle: `Agent ID: ${agent.agent_id}`,
    avatar: agent.avatar,

    // ── Status badge ───────────────────────────────────────────
    badges: [
        {
            label: agent.status.charAt(0).toUpperCase() + agent.status.slice(1),
            color:
                agent.status === "active"
                    ? "bg-green-100 text-green-700"
                    : agent.status === "suspended"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600",
        },
    ],

    // ProfileModal requires details array (icon+label+value).
    // Agent modal is info-only so we pass empty array;
    // all info is shown via checklist rows below.
    details: [] as any[],

    // ── Checklist rows (repurposed to show agent info) ─────────
    checklist: [
        { label: "Email", isComplete: !!agent.email, value: agent.email },
        { label: "Phone", isComplete: !!agent.phone, value: agent.phone },
        { label: "Location", isComplete: !!agent.city, value: agent.city ? `${agent.city}, ${agent.state}` : "—" },
        { label: "Address", isComplete: !!agent.address, value: agent.address || "—" },
        { label: "Bank Name", isComplete: !!agent.bank_name, value: agent.bank_name || "—" },
        { label: "Account No.", isComplete: !!agent.account_number, value: agent.account_number || "—" },
        { label: "IFSC Code", isComplete: !!agent.ifsc_code, value: agent.ifsc_code || "—" },
        { label: "UPI ID", isComplete: !!agent.upi_id, value: agent.upi_id || "—" },
        { label: "Commission (Astrologer)", isComplete: true, value: `${agent.commission_astrologer}%` },
        { label: "Commission (Mandir)", isComplete: true, value: `${agent.commission_mandir}%` },
        { label: "Commission (Puja Shop)", isComplete: true, value: `${agent.commission_puja_shop}%` },
        { label: "Total Listings", isComplete: agent.total_listings > 0, value: String(agent.total_listings) },
        { label: "Total Earned", isComplete: agent.total_earned > 0, value: `₹${agent.total_earned.toLocaleString("en-IN")}` },
        { label: "Pending Payout", isComplete: agent.pending_payout > 0, value: `₹${agent.pending_payout.toLocaleString("en-IN")}` },
        { label: "Joined On", isComplete: true, value: new Date(agent.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
    ],
});
