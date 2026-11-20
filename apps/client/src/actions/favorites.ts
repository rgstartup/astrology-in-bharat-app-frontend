"use server";

import { clientAPI, API_ROUTES, AUTH_COOKIE_NAMES } from "@/actions";
import { getAccessToken } from "@/actions/cookie";
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
    const token = await getAccessToken();

    if (!token) {
      return {
        error: "Please sign in to save this astrologer to your favorites.",
      };
    }

    const endpoint = API_ROUTES.FAVORITES.EXPERT.ADD_TO_FAVORITE.replace(
      ":id",
      String(expertId),
    );

    const result = await clientAPI.post(
      endpoint,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${token}`,
        },
      },
    );

    if (!result.ok) {
      return {
        error: getErrorMessage(result.error) || "Failed to add expert to favorites",
      };
    }

    return {
      success: true,
      isFavorite: true,
      data: result.data,
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
    const token = await getAccessToken();

    if (!token) {
      return {
        error: "Please sign in to update favorites.",
      };
    }

    const endpoint = API_ROUTES.FAVORITES.EXPERT.REMOVE_FROM_FAVORITE.replace(
      ":id",
      String(expertId),
    );

    const result = await clientAPI.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${token}`,
      },
    });

    if (!result.ok) {
      return {
        error:
          getErrorMessage(result.error) || "Failed to remove expert from favorites",
      };
    }

    return {
      success: true,
      isFavorite: false,
      data: result.data,
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
    const token = await getAccessToken();

    if (!token) {
      return [];
    }

    const result = await clientAPI.get<any>(
      API_ROUTES.FAVORITES.EXPERT.LIST,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${token}`,
        },
      },
    );

    if (!result.ok || !result.data) {
      return [];
    }

    const data = result.data;
    return Array.isArray(data) ? data : data?.data || data?.items || [];
  } catch {
    return [];
  }
}
