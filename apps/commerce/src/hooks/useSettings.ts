import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settings.service";
import { productService } from "@/services/product.service";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";

/**
 * Hook to fetch merchant profile settings
 */
export const useMerchantProfile = (options = {}) => {
  return useQuery({
    queryKey: ['merchant-profile'],
    queryFn: async () => {
      const [data, error] = await settingsService.getProfile();
      if (error) {
        throw new Error(getErrorMessage(error) || "Failed to fetch profile");
      }
      return {
        profile: data?.data,
        exists: data?.exists ?? false
      };
    },
    staleTime: 0, // Ensure real-time status updates are reflected
    ...options
  });
};

/**
 * Hook to update merchant profile settings
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const [data, error] = await settingsService.updateProfile(formData);
      if (error) {
        throw new Error(getErrorMessage(error) || "Failed to update profile");
      }
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success("Profile updated successfully!");
      const dataToSave = Object.fromEntries(variables.entries());
      queryClient.setQueryData(['merchant-profile'], (old: any) => {
          if (!old || !old.profile) return old;
          let parsedBankAccounts = old.profile.bank_accounts;
          if (dataToSave.bank_accounts) {
             try { parsedBankAccounts = JSON.parse(dataToSave.bank_accounts as string); } catch(e) {}
          }
          return {
              ...old,
              profile: {
                  ...old.profile,
                  ...dataToSave,
                  bank_accounts: parsedBankAccounts
              }
          };
      });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    }
  });
};

/**
 * Hook to toggle merchant online status
 */
export const useUpdateOnlineStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isOnline: boolean) => {
      console.log(`📤 Sending Online Toggle: ${isOnline}`);
      const [data, error] = await settingsService.updateOnlineStatus(isOnline);
      if (error) {
        console.error("❌ Online Toggle API Error:", error);
        throw new Error(getErrorMessage(error) || "Failed to update online status");
      }
      console.log("✅ Online Toggle API Success:", data);
      return data;
    },
    onSuccess: (_, isOnline) => {
      toast.success(`You are now ${isOnline ? 'Online' : 'Offline'}`);
      queryClient.setQueryData(['merchant-profile'], (old: any) => {
          if (!old || !old.profile) return old;
          return {
              ...old,
              profile: {
                  ...old.profile,
                  isOnline
              }
          };
      });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    }
  });
};

/**
 * Hook to fetch merchant's products
 */
export const useMerchantProducts = () => {
  return useQuery({
    queryKey: ['merchant-products'],
    queryFn: async () => {
      const [data, error] = await productService.getProducts();
      if (error) {
        throw new Error(getErrorMessage(error) || "Failed to fetch products");
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
