# Astrology in Bharat

A comprehensive platform connecting users with professional astrologers for personalized consultations and astrological products. This platform is similar to AstroTalk, offering a variety of services including chat, voice calls, and video calls with verified astrologers.

## 🚀 Technologies

This project is built using a modern and scalable stack to ensure high performance and maintainability.

- **Frontend:** [Next.js](https://nextjs.org/) (v15.4)
- **Backend:** [NestJS](https://nestjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Monorepo:** [TurboRepo](https://turborepo.org/)

## 📁 Project Structure

The project is organized as a monorepo using TurboRepo, which allows us to manage multiple applications and shared packages within a single repository. The main applications are located in the `apps/` directory.

- `/apps`
  - `/consultation`: A dedicated application for all real-time communication features, including chat, voice calls, and video calls between users and astrologers.
  - `/ecommerce`: An e-commerce platform for selling astrology-related products, with secure transaction processing and order management.
  - `/main`: The primary public-facing website, including the landing page, astrologer listings, and user authentication.

## ✨ Features

- **Astrologer Listings:** Browse and filter a wide range of professional astrologers based on their expertise, ratings, and experience.
- **Consultation Services:**
  - **Chat:** Real-time chat with astrologers for quick queries and detailed discussions.
  - **Voice Call:** Schedule and conduct one-on-one voice calls for in-depth consultations.
  - **Video Call:** Face-to-face video consultations for a more personal and interactive experience.
- **E-commerce:**
  - **Astrology Products:** Shop for a variety of products like birthstones, yantras, and books.
  - **Secure Payments:** Integrated payment gateways for safe and easy transactions.
- **User Dashboard:** A personalized dashboard for users to manage their bookings, view consultation history, and track orders.
- **Astrologer Panel:** A dedicated dashboard for astrologers to manage their profiles, schedules, and earnings.

## 🔄 User Flow

### 1. Authentication & Onboarding
- **New User:** Visit the site -> Go to Register -> Receive a verification link on Gmail -> Click the link to verify account -> Redirected to Login.
- **Returning User:** Login via Email and Password OR use **Google Login** for quick access.
- **Forgot Password:** Initiate a password reset flow via email if the password is forgotten.

### 2. Profile Creation
- After registration, users can complete their profile.
- **Details include:** Full name, Profile Picture, Date of Birth (crucial for astrology), and other personal preferences.

### 3. Wallet Management
- Access to consultations and products requires a wallet balance.
- **Wallet Tab:**
  - **Recharge:** Add money to the wallet via integrated payment gateways.
  - **Balance:** Real-time view of current balance and transaction history.
- **Wallet Usage:** Use the balance to pay for per-minute consultations or buy products from the store.

### 4. Consultations (Astrologers)
- **Free Trial:** The first **2 minutes** of a user's consultation are free.
- **Finding Astrologers:**
  - Users can see a curated list of featured astrologers on the homepage.
  - Click **"View All Astrologers"** to see the full, scrollable list.
  - Use **Filters** to narrow down by rating, price, or experience.
  - Filter by **Specialization** (e.g., Vedic, Palmistry, Tarot) to find the right expert.
- **Consultation Modes:**
  - **Chat:** Text-based real-time communication.
  - **Voice Call:** One-on-one audio consultation.
  - **Video Call:** High-quality video session for a personal touch.

### 5. E-commerce Experience
- Browse a collection of astrological products (gemstones, yantras, etc.).
- Add products to the cart and checkout using the **Wallet Balance**.

### 6. User Dashboard Tabs
- **WishList:** A dedicated section to see all astrologers and products that the user has liked/saved for later.
- **Consultation History:** A detailed log of all past consultations (Chat, Voice, Video) with astrologers.

---

## 👨‍🏫 Astrologer (Expert) Flow

The Astrologer's experience is managed through the **Astrologer Dashboard** (`apps/astrologer-dashboard`). 

### 1. Authentication & Onboarding
- **Registration**: Astrologers register with their professional details.
- **Initial Profile**: Upon registration, a basic profile is created. 
- **Onboarding Banner**: If the profile is incomplete or pending verification, a banner informs the astrologer that their account is not yet visible to users.

### 2. Profile Management
Astrologers must complete several sections to build a professional profile:
- **Personal Info**: Name, Gender, Bio, Date of Birth, and Profile Picture.
- **Expertise & Pricing**: 
  - Select Specializations (Vedic, Vastu, Tarot, etc.).
  - Set per-minute rates for **Chat, Voice Call,** and **Video Call**.
  - Set fixed prices for **Reports** and **Horoscopes**.
- **Portfolio & Intro Video**: 
  - Upload a gallery of professional images.
  - Upload an **Introduction Video** (must be between 30 and 90 seconds).
- **Experience**: List detailed professional experience including roles, organizations, and durations.

### 3. Verification & KYC
- **Document Upload**: Astrologers must upload ID proofs (Aadhar/PAN) and professional certificates.
- **KYC Status**: 
  - **Pending**: Profile is under review by Admin.
  - **Approved**: Profile becomes active and visible in the public astrologer list.
  - **Rejected**: A banner displays the rejection reason, allowing the astrologer to correct issues and re-submit.

### 4. Service Management
- **Availability Toggle**: A real-time switch to turn "Online/Offline" status. Only "Online" astrologers appear as "Available" for instant consultations.
- **Products**: Astrologers can create and manage their own products (items) to sell on the e-commerce platform.
- **Consultation Terminal**: Access to real-time chat and call signaling gateways to interact with clients.

### 5. Earnings & Payouts
- **Earnings Tracking**: Real-time view of total earnings from consultations and product sales.
- **Bank Details**: Secure section to manage bank account information for automated or requested payouts.
---

## 👑 Admin Panel Flow (`apps/admin-dashboard`)

The Admin Panel is the management hub for the entire platform, providing high-level control over all users, services, and transactions.

### 🏠 Admin Dashboard Pages:
- **KYC & Verification (`/admin/kyc`, `/admin/kyc-review`)**: 
  - Review identity documents and certificates submitted by Experts and Agents.
  - Approve or Reject profiles with reason codes.
- **Expert Management (`/admin/experts`)**: Manage astrologer profiles, view ratings, adjust visibility, and oversee their earning reports.
- **User Management (`/admin/users`)**: Search, filter, and manage client accounts, including blocking or resetting credentials.
- **Agent Management (`/admin/agents`)**: Strategic oversight of agent activities and verification status.
- **Finance & Payouts (`/admin/payouts`, `/admin/commissions`, `/admin/refunds`)**: 
  - Approve expert withdrawal/payout requests.
  - Set global and individual commission levels.
  - Process customer refunds for failed services.
- **E-commerce & Content (`/admin/products`, `/admin/orders`, `/admin/listings`, `/admin/puja-shops`, `/admin/mandirs`)**: 
  - Moderate individual products and manage bulk inventory.
  - Track orders and shipping statuses.
  - Oversee special religious categories like Mandirs and Puja Shops.
- **Consultation Reviews (`/admin/live-sessions`, `/admin/reviews`, `/admin/disputes`)**: 
  - Monitor ongoing sessions and historical logs.
  - Moderating user feedback and resolving disputes.
- **Analytics & Marketing (`/admin/analytics`, `/admin/coupons`)**: 
  - Detailed data reporting on platform growth, sales, and traffic.
  - Creation and management of promotional discount codes.
- **System Settings (`/admin/settings`, `/admin/services`)**: 
  - Configure site-wide settings and API integrations.
  - Manage the catalog of spiritual services offered.

---

## 🤝 Agent Flow (`apps/agent-dashboard`)

Agents serve as specialized managers focus on regional growth and data entry efficiency.

### Agent Responsibilities:
- **Registration & KYC**: Agents undergo a professional verification process similar to experts.
- **Expert/Listing Management**: Once verified, agents are assigned to manage specific ماہرین (Experts) or product categories.
- **Registration of Others**: Functional logic to onboard new experts or religious services onto the platform.
- **Commission Tracking**: A dedicated dashboard to track earnings generated from managed accounts.

---

To get the project up and running on your local machine, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/astrology-in-bharat.git](https://github.com/your-username/astrology-in-bharat.git)
    cd astrology-in-bharat
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Setup environment variables:**
    Create a `.env` file at the root of each application (`apps/consultation`, `apps/ecommerce`, `apps/main`) and configure the necessary environment variables (e.g., database connection strings, API keys).

4.  **Run the development servers:**
    You can start all applications simultaneously using TurboRepo's command:

    ```bash
    pnpm dev
    ```

    Alternatively, you can run each application individually:

    ```bash
    # Run the main application
    pnpm dev --filter main

    # Run the consultation application
    pnpm dev --filter consultation

    # Run the ecommerce application
    pnpm dev --filter ecommerce
    ```

## 🤝 Contributing

We welcome contributions from the community! If you'd like to contribute, please follow our [Contribution Guidelines](CONTRIBUTING.md).

## 📄 License

This project is licensed under the [MIT License](LICENSE).
