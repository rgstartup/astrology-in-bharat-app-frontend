import { MessageSquare, Filter, AlertCircle, CheckCircle } from "lucide-react";
import type { Review } from "@/app/components/reviews/review";

export const reviewsData: Review[] = [
  {
    id: 1,
    user: "Rahul Sharma",
    astrologer: "Priya Joshi",
    rating: 5,
    comment: "Excellent consultation! Very accurate predictions.",
    date: "2024-01-15",
    status: "approved",
    avatar: "RS",
  },
  {
    id: 2,
    user: "Sneha Patel",
    astrologer: "Amit Kumar",
    rating: 4,
    comment: "Good service, helped me a lot.",
    date: "2024-01-14",
    status: "pending",
    avatar: "SP",
  },
  {
    id: 3,
    user: "Vikram Singh",
    astrologer: "Priya Joshi",
    rating: 1,
    comment: "Completely fake! Waste of money and time.",
    date: "2024-01-13",
    status: "flagged",
    avatar: "VS",
  },
  {
    id: 4,
    user: "Anjali Verma",
    astrologer: "Rajesh Sharma",
    rating: 5,
    comment: "Amazing experience! Highly recommended.",
    date: "2024-01-12",
    status: "approved",
    avatar: "AV",
  },
  {
    id: 5,
    user: "Karan Mehta",
    astrologer: "Amit Kumar",
    rating: 3,
    comment: "Average service, nothing special.",
    date: "2024-01-11",
    status: "pending",
    avatar: "KM",
  },
];

export const getStatsConfig = (reviews: Review[]) => [
  {
    title: "Total Reviews",
    value: reviews.length,
    icon: MessageSquare,
    iconColor: "text-orange-600",
    iconBgColor: "bg-orange-100",
    trend: { value: "+12%", isPositive: true, period: "this month" },
  },
  {
    title: "Pending Review",
    value: reviews.filter((r) => r.status === "pending").length,
    icon: Filter,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-100",
    trend: { value: "-5%", isPositive: false, period: "vs last week" },
  },
  {
    title: "Flagged",
    value: reviews.filter((r) => r.status === "flagged").length,
    icon: AlertCircle,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-100",
    trend: { value: "+2", isPositive: false, period: "need attention" },
  },
  {
    title: "Approved",
    value: reviews.filter((r) => r.status === "approved").length,
    icon: CheckCircle,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-100",
    trend: { value: "+18%", isPositive: true, period: "this month" },
  },
];



