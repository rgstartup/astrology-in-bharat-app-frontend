"use server";

import { cookies } from "next/headers";
import { api, API_ROUTES } from "@/actions";
import { getErrorMessage } from "@repo/lib";

export interface FavoriteActionResponse<T = any> {
  success?: boolean;
  error?: string;
  isFavorite?: boolean;
  data?: T;
}

/**
 * Add an expert to user's favorites
 * Calls POST /client/favorites/expert/:id
 */
export async function addExpertToFavoritesAction(
  expertId: string | number,
): Promise<FavoriteActionResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        error: "Please sign in to save this astrologer to your favorites.",
      };
    }

    const endpoint = API_ROUTES.CLIENT.FAVORITES.EXPERT.ADD_TO_FAVORITE.replace(
      ":id",
      String(expertId),
    );

    const [res, error] = await api.post(
      endpoint,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `accessToken=${token}`,
        },
      },
    );

    if (error) {
      return {
        error: getErrorMessage(error) || "Failed to add expert to favorites",
      };
    }

    return {
      success: true,
      isFavorite: true,
      data: res,
    };
  } catch (err) {
    return {
      error: (err as Error)?.message || "Failed to add expert to favorites",
    };
  }
}

/**
 * Remove an expert from user's favorites
 * Calls DELETE /client/favorites/expert/:id
 */
export async function removeExpertFromFavoritesAction(
  expertId: string | number,
): Promise<FavoriteActionResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        error: "Please sign in to update favorites.",
      };
    }

    const endpoint =
      API_ROUTES.CLIENT.FAVORITES.EXPERT.REMOVE_FROM_FAVORITE.replace(
        ":id",
        String(expertId),
      );

    const [res, error] = await api.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `accessToken=${token}`,
      },
    });

    if (error) {
      return {
        error:
          getErrorMessage(error) || "Failed to remove expert from favorites",
      };
    }

    return {
      success: true,
      isFavorite: false,
      data: res,
    };
  } catch (err) {
    return {
      error:
        (err as Error)?.message || "Failed to remove expert from favorites",
    };
  }
}

/**
 * Toggle an expert in user's favorites
 */
export async function toggleExpertFavoriteAction(
  expertId: string | number,
  isCurrentlyFavorite: boolean,
): Promise<FavoriteActionResponse> {
  if (isCurrentlyFavorite) {
    return removeExpertFromFavoritesAction(expertId);
  } else {
    return addExpertToFavoritesAction(expertId);
  }
}

/**
 * Fetch list of user's favorite experts
 * Calls GET /client/favorites/expert
 */
export async function getFavoriteExpertsAction(): Promise<any[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return [];
    }

    const [res, error] = await api.get<any>(
      API_ROUTES.CLIENT.FAVORITES.EXPERT.LIST,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `accessToken=${token}`,
        },
      },
    );

    if (error || !res) {
      return [];
    }

    return Array.isArray(res) ? res : res?.data || res?.items || [];
  } catch {
    return [];
  }
}
