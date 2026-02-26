import StaticPageLayout from "@/components/layout/StaticPageLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Astrology in Bharat",
    description: "Read the Privacy Policy of Astrology in Bharat. We value your privacy and protect your personal data.",
};

export default function PrivacyPolicyPage() {
    return (
        <StaticPageLayout title="Privacy Policy">
            <p>Last updated: February 12, 2026</p>
            <p>
                At Astrology in Bharat, accessible from astrologyinbharat.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Astrology in Bharat and how we use it.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
                If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
            </p>
            <p>
                When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number. For astrological services, we also collect birth details including date of birth, time of birth, and place of birth.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect in various ways, including to:</p>
            <ul>
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, either directly or through one of our partners</li>
                <li>Provide accurate astrological predictions and consultations</li>
                <li>Send you emails and notifications regarding your consultations</li>
                <li>Find and prevent fraud</li>
            </ul>

            <h2>3. Log Files</h2>
            <p>
                Astrology in Bharat follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
            </p>

            <h2>4. Cookies and Web Beacons</h2>
            <p>
                Like any other website, Astrology in Bharat uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            </p>

            <h2>5. Privacy of Consultations</h2>
            <p>
                We understand that astrological consultations are personal and private. All chats, calls, and video sessions are strictly confidential between the user and the astrologer. We do not record or share your consultation details with third parties without your explicit consent.
            </p>

            <h2>6. Data Protection Rights</h2>
            <p>
                We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
            </p>
            <ul>
                <li>The right to access – You have the right to request copies of your personal data.</li>
                <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
                <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at support@astrologyinbharat.com.
            </p>
        </StaticPageLayout>
    );
}


