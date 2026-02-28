export const normalizeName = (name = "") => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
};

export const hashSeed = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

export const formatIndianCurrency = (amount: number) => {
    if (amount >= 10000000) {
        return (amount / 10000000).toFixed(2) + ' Cr';
    }
    if (amount >= 100000) {
        return (amount / 100000).toFixed(2) + ' Lakh';
    }
    return amount.toLocaleString('en-IN');
};

export const getJobTier = (job: string) => {
    const jobLower = job.toLowerCase();
    if (jobLower.includes('engineer') || jobLower.includes('doctor') || jobLower.includes('ca')) {
        return 3;
    }
    if (jobLower.includes('manager') || jobLower.includes('director') || jobLower.includes('founder')) {
        return 4;
    }
    if (jobLower.includes('teacher') || jobLower.includes('nurse') || jobLower.includes('clerk')) {
        return 2;
    }
    return 1;
};

export const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const getMessageByDahej = (dahej: number) => {
    if (dahej < 1000000) {
        return "Modest beginnings! Focus on love and partnership over material wealth.";
    }
    if (dahej >= 1000000 && dahej < 5000000) {
        return "Comfortable match! This union has good financial stability and growth potential.";
    }
    if (dahej >= 5000000 && dahej < 15000000) {
        return "Excellent prospects! A life of comfort and mutual respect awaits.";
    }
    return "Royal match! This partnership is destined for prosperity and abundance.";
};
