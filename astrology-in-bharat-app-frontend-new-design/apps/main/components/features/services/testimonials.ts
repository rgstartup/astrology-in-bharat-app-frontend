//  Clients Testimoinial Data
interface TestimoinialData {
    id: number;
    name: string;
    review: string;
    image: string;
    rating: number;
}
export const ClientsTestimoinialData: TestimoinialData[] = [
    {
        id: 1,
        name: "Rahul Verma",
        review:
            "Amazing experience! The astrologer was very accurate and gave me practical solutions. Highly recommended.",
        image: "/images/client1.jpg",
        rating: 5,
    },
    {
        id: 2,
        name: "Priya Sharma",
        review:
            "Very satisfied! The consultation was insightful and helped me make better decisions in my career.",
        image: "/images/client2.jpg",
        rating: 5,
    },
    {
        id: 3,
        name: "Ankit Singh",
        review:
            "Great guidance and very polite. The remedies suggested worked really well for me.",
        image: "/images/client3.jpg",
        rating: 4.5,
    },
];
