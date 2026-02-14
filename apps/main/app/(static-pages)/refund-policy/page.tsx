import StaticPageLayout from "@/components/layout/StaticPageLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Refund Policy | Astrology in Bharat",
    description: "Understand the refund and cancellation policy for consultations and services at Astrology in Bharat.",
};

export default function RefundPolicyPage() {
    return (
        <StaticPageLayout title="Refund Policy">
            <p>Last updated: February 12, 2026</p>

            <h2>1. General Refund Policy</h2>
            <p>
                At Astrology in Bharat, we strive to provide the best astrological services. However, if you are not satisfied with our services, we have a clear refund policy to protect your interests.
            </p>

            <h2>2. Consultation Refunds</h2>
            <p>Refunds for Chat/Call/Video consultations are applicable under the following conditions:</p>
            <ul>
                <li><strong>Network Issues:</strong> If there is a technical glitch from our side or the astrologer's side that prevents the consultation from happening.</li>
                <li><strong>Astrologer Unavailability:</strong> If the astrologer does not join the session after booking.</li>
                <li><strong>Incomplete Session:</strong> If the session is disconnected prematurely due to platform issues.</li>
            </ul>
            <p>
                Please note that refunds are NOT applicable if the user is dissatisfied with the predictions or advice provided, as astrology is a matter of belief and interpretation.
            </p>

            <h2>3. Digital Products</h2>
            <p>
                For digital products like Kundali reports, Horoscope reports, or any other downloadable content, refunds are typically not provided once the report has been generated and delivered, as these are personalized items.
            </p>

            <h2>4. Physical Products (Shop)</h2>
            <p>
                If you purchase physical items (Gemstones, Malas, etc.) from our shop:
            </p>
            <ul>
                <li>Refunds are applicable if the product received is damaged or significantly different from the description.</li>
                <li>You must report the issue within 48 hours of delivery with supporting photographs.</li>
                <li>The product must be returned in its original packaging.</li>
            </ul>

            <h2>5. Process for Requesting a Refund</h2>
            <p>
                To request a refund, please email us at <strong>support@astrologyinbharat.com</strong> with the following details:
            </p>
            <ul>
                <li>Order ID / Session ID</li>
                <li>Date and Time of the transaction</li>
                <li>Reason for refund request</li>
                <li>Supportive screenshots (if any)</li>
            </ul>
            <p>
                The refund request will be reviewed by our team within 5-7 working days. If approved, the amount will be credited back to your original payment method or wallet within 7-10 working days.
            </p>

            <h2>6. Wallet Balance</h2>
            <p>
                Money added to the Astrology in Bharat wallet is generally non-refundable but can be used for any future consultations or purchases on the platform.
            </p>

            <h2>Contact Us</h2>
            <p>
                For any further queries regarding refunds, please contact us at support@astrologyinbharat.com.
            </p>
        </StaticPageLayout>
    );
}
