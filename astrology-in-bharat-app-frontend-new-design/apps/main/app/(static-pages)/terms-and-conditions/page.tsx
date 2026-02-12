import StaticPageLayout from "@/components/layout/StaticPageLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions | Astrology in Bharat",
    description: "Read the terms and conditions for using the Astrology in Bharat platform and services.",
};

export default function TermsAndConditionsPage() {
    return (
        <StaticPageLayout title="Terms & Conditions">
            <p>Last updated: February 12, 2026</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
                By accessing and using Astrology in Bharat ("the Website" or "the Platform"), you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.
            </p>

            <h2>2. Nature of Service</h2>
            <p>
                Astrology in Bharat is an internet-based portal providing astrological content, reports, and consultations via chat, call, and video. You understand that astrology is based on individual belief and interpretation, and we do not guarantee the accuracy or reliability of any predictions.
            </p>

            <h2>3. User Account</h2>
            <p>
                To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information during registration.
            </p>

            <h2>4. User Conduct</h2>
            <p>By using the platform, you agree not to:</p>
            <ul>
                <li>Abuse, harass, or threaten astrologers or other users.</li>
                <li>Post any content that is defamatory, obscene, or violates any law.</li>
                <li>Attempt to circumvent the payment system or share personal contact details with astrologers for direct transactions.</li>
                <li>Use the platform for any fraudulent or illegal activities.</li>
            </ul>

            <h2>5. Payments and Charges</h2>
            <p>
                Consultations are charged on a per-minute basis or a fixed fee as specified. Payments must be made in advance using the platform's payment gateway or wallet. Applicable taxes will be added to the transaction.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
                All content on this website, including text, graphics, logos, and software, is the property of Astrology in Bharat or its content suppliers and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without explicit permission.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
                Astrology in Bharat and its astrologers shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the services or from any advice or predictions provided during a consultation.
            </p>

            <h2>8. Disclaimer</h2>
            <p>
                Astrological variations and predictions are for entertainment and guidance purposes only. They should not be considered a substitute for professional medical, legal, or financial advice.
            </p>

            <h2>9. Governing Law</h2>
            <p>
                These terms are governed by and construed in accordance with the laws of India. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the courts in India.
            </p>

            <h2>Contact Us</h2>
            <p>
                If you have any questions about these Terms and Conditions, please contact us at legal@astrologyinbharat.com.
            </p>
        </StaticPageLayout>
    );
}
