import StaticPageLayout from "@/components/layout/StaticPageLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Copyright Notice | Astrology in Bharat",
    description: "Copyright information and intellectual property rights notice for Astrology in Bharat.",
};

export default function CopyrightNoticePage() {
    return (
        <StaticPageLayout title="Copyright Notice">
            <p>Last updated: February 12, 2026</p>

            <h2>1. Ownership of Content</h2>
            <p>
                The content available on the Astrology in Bharat website, including but not limited to text, images, graphics, logos, icons, audio clips, video clips, data compilations, software, and the "look and feel" of the site, is the property of Astrology in Bharat or its licensors.
            </p>

            <h2>2. Copyright Protection</h2>
            <p>
                All content is protected by Indian and international copyright, trademark, and other intellectual property laws. All rights reserved. The compilation of all content on this site is the exclusive property of Astrology in Bharat.
            </p>

            <h2>3. Limited License</h2>
            <p>
                We grant you a limited, non-transferable, and non-exclusive license to access and make personal, non-commercial use of this website. You are not allowed to:
            </p>
            <ul>
                <li>Download, modify, or distribute any part of the website without express written consent.</li>
                <li>Use any data mining, robots, or similar data gathering and extraction tools.</li>
                <li>Reproduce, duplicate, copy, sell, or otherwise exploit the content for any commercial purpose.</li>
                <li>Frame or utilize framing techniques to enclose any trademark, logo, or other proprietary information.</li>
            </ul>

            <h2>4. Infringement Policy</h2>
            <p>
                Astrology in Bharat respects the intellectual property of others. If you believe that your work has been copied in a way that constitutes copyright infringement, please provide us with the following information:
            </p>
            <ul>
                <li>A description of the copyrighted work that you claim has been infringed.</li>
                <li>A description of where the material that you claim is infringing is located on the site.</li>
                <li>Your address, telephone number, and email address.</li>
                <li>A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
            </ul>

            <h2>5. Trademark Information</h2>
            <p>
                "Astrology in Bharat" and related graphics, logos, and service names are trademarks or trade dress of Astrology in Bharat. They may not be used in connection with any product or service that is not ours, in any manner that is likely to cause confusion among customers, or in any manner that disparages or discredits Astrology in Bharat.
            </p>

            <h2>Contact Information</h2>
            <p>
                Requests for permission to use any content from this website should be directed to copyright@astrologyinbharat.com.
            </p>

            <p className="mt-8 font-semibold">
                © 2026 Astrology in Bharat. All rights reserved.
            </p>
        </StaticPageLayout>
    );
}
