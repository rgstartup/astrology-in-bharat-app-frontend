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

## ⚙️ Getting Started

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
    npm install
    ```

3.  **Setup environment variables:**
    Create a `.env` file at the root of each application (`apps/consultation`, `apps/ecommerce`, `apps/main`) and configure the necessary environment variables (e.g., database connection strings, API keys).

4.  **Run the development servers:**
    You can start all applications simultaneously using TurboRepo's command:

    ```bash
    npm run dev
    ```

    Alternatively, you can run each application individually:

    ```bash
    # Run the main application
    npm run dev --workspace=main

    # Run the consultation application
    npm run dev --workspace=consultation

    # Run the ecommerce application
    npm run dev --workspace=ecommerce
    ```

## 🤝 Contributing

We welcome contributions from the community! If you'd like to contribute, please follow our [Contribution Guidelines](CONTRIBUTING.md).

## 📄 License

This project is licensed under the [MIT License](LICENSE).
