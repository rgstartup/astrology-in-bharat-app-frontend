"use client";

const STORAGE_KEY = "platform_review_shown";

export const getReviewModal = () => {
  const review = localStorage.getItem(STORAGE_KEY);
  if (!review) {
    console.log("review modal value not set");
    return;
  }

  try {
    return JSON.parse(review);
  } catch (error) {
    console.error("unable to parse review", error);
  }
};

export const setReviewModal = (value: boolean) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
};
