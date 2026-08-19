import { Store } from "@/lib/types/shop";

export const listOfStores: Store[] = [
    {
        id: 1,
        name: "Jai Durga Spiritual Store",
        address: "K-54/23, Near Kashi Vishwanath Temple, Varanasi",
        city: "Varanasi",
        pincode: "221001",
        phone: "+91 98765 43210",
        image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=800&auto=format&fit=crop",
        isTrusted: true,
        popularProducts: [
            "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1512418490979-917959338e74?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=400&fit=crop"
        ],
        rating: 4.8,
        reviewCount: 124,
        description: "A premier destination for authentic spiritual artifacts and puja essentials in the holy city of Varanasi. We specialize in rare idols, energized yantras, and high-quality incense to elevate your spiritual practices.",
        established: "1992",
        email: "contact@jaidurga-spiritual.com",
        gallery: [
            "https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800&auto=format&fit=crop"
        ],
        features: ["Authentic Murti", "Vedic Energized Items", "Same Day Delivery in Kashi"]
    },
    {
        id: 2,
        name: "Haridwar Gems & Rudraksha",
        address: "Shantikunj, Sapt Rishi Marg, Haridwar",
        city: "Haridwar",
        pincode: "249401",
        phone: "+91 87654 32109",
        image: "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb0?q=80&w=800&auto=format&fit=crop",
        isTrusted: true,
        popularProducts: [
            "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1512418490979-917959338e74?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=400&fit=crop"
        ],
        rating: 4.9,
        reviewCount: 256,
        description: "Specializing in GIA-certified gemstones and authentic Himalayan Rudrakshas. Our legacy spans over three decades, providing spiritual seekers with tested and proven remedies for astrological balance.",
        established: "1985",
        email: "rudraksha@haridwar-gems.com",
        gallery: [
            "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1512418490979-917959338e74?q=80&w=800&auto=format&fit=crop"
        ],
        features: ["Certified Lab Reports", "Pancmukhi Specialists", "Vedic Alignment Advice"]
    },
    {
        id: 3,
        name: "Vedic Vastu Kendra",
        address: "Sector 18, Near Gurudwara, Noida",
        city: "Noida",
        pincode: "201301",
        phone: "+91 76543 21098",
        image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800&auto=format&fit=crop",
        isTrusted: false,
        popularProducts: [
            "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1512418490979-917959338e74?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=400&fit=crop"
        ],
        rating: 4.2,
        reviewCount: 45,
        description: "A one-stop solution for Vastu products and expert consultations. We help homeowners and business owners align their spaces with cosmic energy using traditional Vedic principles and remedial tools.",
        established: "2010",
        email: "vastukendra@noida.com",
        gallery: [
            "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=800&auto=format&fit=crop"
        ],
        features: ["Expert Vastu Audits", "Copper Pyramid Dealers", "Vedic Space Alignment"]
    },
    {
        id: 4,
        name: "Astro Remedies Hub",
        address: "M.G. Road, Near High Court, Prayagraj",
        city: "Prayagraj",
        pincode: "211001",
        phone: "+91 95550 12345",
        image: "https://images.unsplash.com/photo-1512418490979-917959338e74?q=80&w=800&auto=format&fit=crop",
        isTrusted: true,
        popularProducts: [
            "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1512418490979-917959338e74?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=400&fit=crop"
        ],
        rating: 4.7,
        reviewCount: 89,
        description: "Specializing in astrological remedies including custom-made talisman and energized crystals. Our store is guided by generations of astronomical wisdom from the Sangam city of Prayagraj.",
        established: "1998",
        email: "remedies@prayagraj-astro.com",
        gallery: [
            "https://images.unsplash.com/photo-1512418490979-917959338e74?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=800&auto=format&fit=crop"
        ],
        features: ["Siddha Talismans", "Sangam Blessed Items", "Energized Crystals"]
    },
    {
        id: 5,
        name: "Sacred Stones Palace",
        address: "Johari Bazar, Pink City, Jaipur",
        city: "Jaipur",
        pincode: "302001",
        phone: "+91 91110 54321",
        image: "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=800&auto=format&fit=crop",
        isTrusted: true,
        popularProducts: [
            "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1512418490979-917959338e74?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=400&fit=crop"
        ],
        rating: 4.6,
        reviewCount: 167,
        description: "Known throughout Jaipur's Johari Bazar for high-end precious gemstones. We provide Vedic-compliant jewelry that combines spiritual efficacy with premium craftsmanship.",
        established: "2005",
        email: "palace@jaipur-gemstones.com",
        gallery: [
            "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=800&auto=format&fit=crop"
        ],
        features: ["Premium Gemstones", "Traditional Jewelry", "Stone Authenticity Checked"]
    },
    {
        id: 6,
        name: "Divine Devotion Shop",
        address: "Near Golden Temple, Amritsar",
        city: "Amritsar",
        pincode: "143001",
        phone: "+91 98887 65432",
        image: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=800&auto=format&fit=crop",
        isTrusted: true,
        popularProducts: [
            "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1512418490979-917959338e74?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=400&fit=crop",
            "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=400&fit=crop"
        ],
        rating: 4.8,
        reviewCount: 312,
        description: "Offering a serene collection of bhakti essentials and spiritual literature. Each item in our store is selected for its purity and ability to enhance your daily devotional practices.",
        established: "2012",
        email: "devotion@amritsar.com",
        gallery: [
            "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=800&auto=format&fit=crop"
        ],
        features: ["Sacred Literature", "Puja Accessories", "Purity Guaranteed"]
    }
];
