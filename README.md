# SmartShop - College Mess E-commerce

SmartShop is a comprehensive college mess e-commerce application designed to digitize and simplify the way students purchase and manage mess services. It bridges the gap between students and the mess committee by offering a transparent, efficient, and user-friendly platform for meal subscriptions, menu tracking, and feedback.

## Features

### 🎓 For Students
*   **Secure Authentication**: Log in using official college credentials, ensuring exclusive access for registered students.
*   **Meal Plan Subscriptions**: Browse and purchase daily, weekly, or monthly meal plans (Veg/Non-Veg) with transparent pricing.
*   **E-commerce Experience**: Add plans or individual meals to a cart and proceed to checkout seamlessly.
*   **Payment Gateway**: Integrated dummy/test payment system for secure transactions.
*   **Order Management**: View order confirmation and access a detailed transaction history.
*   **Digital Menu Board**: Check daily and weekly menus to know exactly what's being served.
*   **Meal Booking & Analytics**: Opt-in or opt-out of specific meals to help reduce food wastage.
*   **Dashboard**: A personalized dashboard showing active plans, remaining days, and subscription status.
*   **Feedback & Support**: Rate meals, provide feedback, and register complaints directly through the app.
*   **Notifications**: Stay updated with menu changes, payment reminders, and announcements.

### 🏢 For Mess Committee (Admin)
*   **Plan Management**: Create and update meal plans, pricing, and subscription durations.
*   **Menu Updates**: Easily upload and edit daily/weekly menus.
*   **Order Statistics**: View real-time data on purchased plans and expected meal counts.
*   **Financial Records**: Track payments and transaction histories.
*   **Feedback Analysis**: Review student ratings and complaints to improve service quality.
*   **Wastage Control**: Use opt-in/opt-out data to prepare the right amount of food.

## 🛠 Tech Stack Requirements

As per project guidelines, the following technologies are used:

1.  **Database**: SQLite3
2.  **ORM**: Prisma
3.  **API**: RESTful API implementing full CRUD operations
4.  **Deployment**:
    *   **Backend**: Render
    *   **Frontend**: Vercel
5.  **CORS**: Properly configured to allow communication between the deployed frontend and backend.

## 🚀 Getting Started

*(Instructions for setting up the project locally)*

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/SmartShop.git
    cd SmartShop
    ```

2.  **Install Dependencies**
    ```bash
    # For Backend
    cd server
    npm install
    
    # For Frontend
    cd ../client
    npm install
    ```

3.  **Environment Setup**
    *   Configure `.env` files for both client and server with necessary API keys and database creation URLs.

4.  **Run Locally**
    *   Start the server and client development servers.

---
*SmartShop transforms the traditional mess system into a modern, service-based e-commerce platform.*
