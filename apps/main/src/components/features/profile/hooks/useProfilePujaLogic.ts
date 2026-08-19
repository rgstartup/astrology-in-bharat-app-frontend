import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { getMyPujaAppointments, updatePujaAppointmentStatus } from "@/libs/api-profile";
import { getErrorMessage } from "@repo/lib";

export const useProfilePujaLogic = (isAuthenticated: boolean, activeTab: string) => {
    const [pujaBookings, setPujaBookings] = useState<any[]>([]);
    const [loadingPuja, setLoadingPuja] = useState(false);

    const loadPujaBookings = useCallback(async () => {
        if (activeTab === "pujas" && isAuthenticated) {
            setLoadingPuja(true);
            try {
                const [data, error] = await getMyPujaAppointments();
                if (!error && data) {
                    setPujaBookings(Array.isArray(data) ? data : (data.data || []));
                }
            } catch (err) {
                console.error("Failed to load puja bookings:", err);
            } finally {
                setLoadingPuja(false);
            }
        }
    }, [activeTab, isAuthenticated]);

    useEffect(() => {
        loadPujaBookings();
    }, [loadPujaBookings]);

    const handleUpdatePujaStatus = async (id: string, status: string, extra: any = {}) => {
        const [res, error] = await updatePujaAppointmentStatus(id, { status, ...extra });
        if (error) {
            toast.error(getErrorMessage(error) || "Failed to update booking");
            return false;
        }
        toast.success(`Booking ${status} successfully`);
        loadPujaBookings();
        return true;
    };

    return {
        pujaBookings,
        loadingPuja,
        loadPujaBookings,
        handleUpdatePujaStatus
    };
};
