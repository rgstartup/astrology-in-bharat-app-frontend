import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    getProfile, 
    updatePersonalInfo, 
    updatePricing, 
    updatePortfolio, 
    updateCertificates, 
    updateDocuments, 
    updateExperience, 
    getTodos, 
    createTodo, 
    updateTodo, 
    deleteTodoApi,
    createProfile,
    updateProfile,
    updateExpertStatus
} from "@/lib/profile";
import { Profile, Gender, Todo, DocumentItem } from "@/types/profile";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";

/**
 * Transforms raw API or Auth user data into the standardized Profile interface.
 */
const mapToProfile = (data: any, authUser: any): Profile & { exists: boolean } => {
    const firstAddress = data?.addresses?.[0] || authUser?.addresses?.[0];
    
    return {
        exists: !!data,
        name: data?.user?.name || data?.name || authUser?.name || "",
        email: data?.user?.email || data?.email || authUser?.email || "",
        gender: data?.gender || authUser?.gender || Gender.OTHER,
        bio: data?.bio || authUser?.bio || "",
        about: data?.about || authUser?.about || "",
        specialization: data?.specialization || authUser?.specialization || "",
        experience_in_years: data?.experience_in_years || authUser?.experience_in_years || 0,
        languages: typeof data?.languages === 'string' 
            ? data.languages.split(',').map((l: string) => l.trim()) 
            : (data?.languages || authUser?.languages || []),
        price: data?.price || authUser?.price || 0,
        chat_price: data?.chat_price || authUser?.chat_price || 0,
        call_price: data?.call_price || authUser?.call_price || 0,
        video_call_price: data?.video_call_price || authUser?.video_call_price || 0,
        report_price: data?.report_price || authUser?.report_price || 0,
        horoscope_price: data?.horoscope_price || authUser?.horoscope_price || 0,
        phoneNumber: data?.phone_number || authUser?.phone_number || "",
        houseNo: firstAddress?.house_no || firstAddress?.line1 || "",
        state: firstAddress?.state || "",
        district: firstAddress?.district || firstAddress?.city || "",
        country: firstAddress?.country || "",
        pincode: firstAddress?.pincode || firstAddress?.zip_code || "",
        bank_details: data?.bank_details || authUser?.bank_details || "",
        is_available: data?.is_available ?? authUser?.is_available ?? false,
        kycStatus: data?.kyc_status || authUser?.kyc_status || authUser?.status || "pending",
        kycCompleted: (data?.kyc_status || authUser?.kyc_status || authUser?.status) === 'approved' || (data?.kyc_status || authUser?.kyc_status || authUser?.status) === 'active',
        addresses: (data?.addresses || authUser?.addresses || []).map((a: any) => ({
            line1: a.line1 || a.street,
            line2: a.line2,
            city: a.city,
            state: a.state,
            country: a.country,
            zipCode: a.zip_code,
            pincode: a.pincode,
            houseNo: a.house_no,
            tag: a.tag
        })),
        profilePic: data?.user?.avatar || data?.avatar || authUser?.avatar || authUser?.profilePic || "",
        certificates: data?.certificates || authUser?.certificates || [],
        gallery: data?.gallery || authUser?.gallery || [],
        videos: data?.videos || authUser?.videos || [],
        video: data?.video || authUser?.video || "",
        detailed_experience: data?.detailed_experience || authUser?.detailed_experience || [],
        date_of_birth: data?.date_of_birth || authUser?.date_of_birth,
        documents: data?.documents || authUser?.documents || [],
    };
};

/**
 * Whitelisted fields for each segmented API endpoint to prevent 400 Bad Request.
 */
const SECTION_WHITELISTS: Record<string, string[]> = {
    personal: ['name', 'gender', 'bio', 'about', 'specialization', 'experience_in_years', 'languages', 'date_of_birth', 'phone_number', 'addresses', 'avatar'],
    pricing: ['price', 'chat_price', 'call_price', 'video_call_price', 'report_price', 'horoscope_price', 'specialization'],
    status: ['is_available'],
    portfolio: ['gallery', 'videos', 'video'],
    experience: ['detailed_experience'],
    documents: ['documents'],
    certificates: ['certificates']
};

const getSegmentedData = (data: any, section: string) => {
    const whitelist = SECTION_WHITELISTS[section];
    if (!whitelist) return data;
    
    const filtered: any = {};
    whitelist.forEach(key => {
        if (data[key] !== undefined) {
            filtered[key] = data[key];
        }
    });

    // Special cases: backend might expect slightly different names than Profile interface
    if (section === 'personal' && data.profilePic !== undefined) {
        filtered.avatar = data.profilePic;
    }
    if (section === 'personal' && data.phoneNumber !== undefined) {
        filtered.phone_number = data.phoneNumber;
    }

    return filtered;
};

/**
 * Constructs the payload for the API based on the Profile interface.
 */
export const constructProfilePayload = (profile: Profile) => {
    const hasAddressData = profile.houseNo || profile.district || profile.state || profile.country || profile.pincode;
    const addressesArray = hasAddressData ? [{
        line1: profile.houseNo || "",
        house_no: profile.houseNo || "",
        city: profile.district || "",
        district: profile.district || "",
        state: profile.state || "",
        country: profile.country || "",
        zip_code: profile.pincode || "",
        pincode: profile.pincode || ""
    }] : [];

    return {
        name: profile.name,
        gender: profile.gender,
        specialization: profile.specialization,
        bio: profile.bio,
        about: profile.about,
        experience_in_years: Number(profile.experience_in_years),
        languages: Array.isArray(profile.languages) ? profile.languages : [],
        price: Number(profile.price),
        chat_price: Number(profile.chat_price),
        call_price: Number(profile.call_price),
        video_call_price: String(profile.video_call_price),
        report_price: Number(profile.report_price),
        horoscope_price: Number(profile.horoscope_price),
        bank_details: profile.bank_details,
        is_available: profile.is_available,
        date_of_birth: profile.date_of_birth,
        phone_number: profile.phoneNumber,
        addresses: addressesArray,
        avatar: profile.profilePic,
        gallery: profile.gallery,
        videos: profile.videos,
        video: profile.video,
        detailed_experience: (profile.detailed_experience || []).map((exp: any) => ({
            title: exp.role || exp.title || "Expert",
            role: exp.role || exp.title || "Expert",
            company: exp.company || exp.organization || "Freelance",
            organization: exp.company || exp.organization || "Freelance",
            description: exp.description || "",
            startDate: exp.startDate,
            endDate: exp.endDate,
            isCurrent: exp.isCurrent || false,
            location: exp.location || "Remote"
        })),
        certificates: profile.certificates,
        documents: (profile.documents || []).map(doc => ({
            id: doc.id,
            name: doc.name,
            url: doc.url,
            type: doc.type,
            category: doc.category,
            side: doc.side
        }))
    };
};

export const useProfile = () => {
    const { user: authUser } = useAuthStore();
    const queryClient = useQueryClient();

    // 1. Fetch Profile Query
    const profileQuery = useQuery({
        queryKey: ["profile", authUser?.id],
        queryFn: async () => {
            const [data, error] = await getProfile();
            if (error && error.status !== 404) throw new Error(getErrorMessage(error));
            return mapToProfile(data, authUser);
        },
        enabled: !!authUser?.id,
    });

    // 2. Fetch Todos Query
    const todosQuery = useQuery({
        queryKey: ["todos"],
        queryFn: async () => {
            const [data, error] = await getTodos();
            if (error) throw new Error(getErrorMessage(error));
            return data || [];
        },
        enabled: !!authUser?.id,
    });

    // 3. Generic Update Mutation
    const updateMutation = useMutation({
        mutationFn: async ({ section, data, isNew }: { section: string; data: any; isNew?: boolean }) => {
            let result;
            if (isNew) {
                result = await createProfile(data);
            } else {
                // Filter payload to only include whitelisted fields for this section
                const filteredData = getSegmentedData(data, section);
                
                switch (section) {
                    case 'personal': result = await updatePersonalInfo(filteredData); break;
                    case 'pricing': result = await updatePricing(filteredData); break;
                    case 'status': result = await updateExpertStatus(data.is_available); break;
                    case 'portfolio': result = await updatePortfolio(filteredData); break;
                    case 'certificates': result = await updateCertificates(filteredData.certificates); break;
                    case 'documents': result = await updateDocuments(filteredData.documents); break;
                    case 'experience': result = await updateExperience(filteredData.detailed_experience); break;
                    default: result = await updateProfile(filteredData);
                }
            }
            const [res, error] = result;
            if (error) throw new Error(getErrorMessage(error));
            return res;
        },
        onSuccess: (_, variables) => {
            const sentData = variables.data;

            // Map sent backend fields → frontend Profile cache fields (no extra API call)
            queryClient.setQueryData(["profile", authUser?.id], (oldData: any) => {
                if (!oldData) return oldData;

                const updated: any = { ...oldData };

                // Direct field mappings
                if (sentData.name !== undefined) updated.name = sentData.name;
                if (sentData.gender !== undefined) updated.gender = sentData.gender;
                if (sentData.bio !== undefined) updated.bio = sentData.bio;
                if (sentData.specialization !== undefined) updated.specialization = sentData.specialization;
                if (sentData.experience_in_years !== undefined) updated.experience_in_years = sentData.experience_in_years;
                if (sentData.date_of_birth !== undefined) updated.date_of_birth = sentData.date_of_birth;
                if (sentData.languages !== undefined) updated.languages = Array.isArray(sentData.languages) ? sentData.languages : [];
                if (sentData.phone_number !== undefined) updated.phoneNumber = sentData.phone_number;
                if (sentData.avatar !== undefined) updated.profilePic = sentData.avatar;

                // Pricing fields
                if (sentData.price !== undefined) updated.price = sentData.price;
                if (sentData.chat_price !== undefined) updated.chat_price = sentData.chat_price;
                if (sentData.call_price !== undefined) updated.call_price = sentData.call_price;
                if (sentData.video_call_price !== undefined) updated.video_call_price = sentData.video_call_price;
                if (sentData.report_price !== undefined) updated.report_price = sentData.report_price;
                if (sentData.horoscope_price !== undefined) updated.horoscope_price = sentData.horoscope_price;

                // Address mapping: backend array → flattened frontend fields
                if (sentData.addresses && Array.isArray(sentData.addresses) && sentData.addresses.length > 0) {
                    const addr = sentData.addresses[0];
                    updated.houseNo = addr.house_no || addr.line1 || "";
                    updated.district = addr.district || addr.city || "";
                    updated.state = addr.state || "";
                    updated.country = addr.country || "";
                    updated.pincode = addr.pincode || addr.zip_code || "";
                }

                // Portfolio/Experience fields
                if (sentData.gallery !== undefined) updated.gallery = sentData.gallery;
                if (sentData.videos !== undefined) updated.videos = sentData.videos;
                if (sentData.video !== undefined) updated.video = sentData.video;
                if (sentData.certificates !== undefined) updated.certificates = sentData.certificates;
                if (sentData.detailed_experience !== undefined) updated.detailed_experience = sentData.detailed_experience;
                if (sentData.documents !== undefined) updated.documents = sentData.documents;

                return updated;
            });

            toast.success(`${variables.section.charAt(0).toUpperCase() + variables.section.slice(1).replace('_', ' ')} updated!`);
        }
    });

    // 4. Todo Mutations
    const todoMutations = {
        add: useMutation({
            mutationFn: async (text: string) => {
                const [res, error] = await createTodo(text);
                if (error) throw new Error(getErrorMessage(error));
                return res;
            },
            onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
        }),
        toggle: useMutation({
            mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
                const [res, error] = await updateTodo(id, { completed });
                if (error) throw new Error(getErrorMessage(error));
                return res;
            },
            onSuccess: (_, variables) => {
                queryClient.setQueryData(["todos"], (oldData: any) => {
                    if (!oldData) return [];
                    return oldData.map((todo: any) => todo.id === variables.id ? { ...todo, completed: variables.completed } : todo);
                });
            },
        }),
        delete: useMutation({
            mutationFn: async (id: string) => {
                const [res, error] = await deleteTodoApi(id);
                if (error) throw new Error(getErrorMessage(error));
                return res;
            },
            onSuccess: (_, id) => {
                queryClient.setQueryData(["todos"], (oldData: any) => {
                    if (!oldData) return [];
                    return oldData.filter((todo: any) => String(todo.id) !== String(id));
                });
            },
        }),
    };

    return {
        profile: profileQuery.data,
        isLoading: profileQuery.isLoading,
        isFetching: profileQuery.isFetching,
        hasProfile: !!profileQuery.data?.exists,
        todos: todosQuery.data || [],
        updateSection: updateMutation.mutateAsync,
        isSubmitting: updateMutation.isPending,
        todoActions: {
            add: todoMutations.add.mutateAsync,
            toggle: todoMutations.toggle.mutateAsync,
            remove: todoMutations.delete.mutateAsync,
        }
    };
};
