# React Product Listing Website with Order Functionality

This project is a React-based website that displays a list of products fetched from an API and allows users to view product details and place orders. It utilizes Flowbite React for UI components and Framer Motion for animations.

## Features

* **Product Listing:** Displays products fetched from the `https://admin.refabry.com/api/all/product/get` API.
* **Product Details:** Clicking on a product card opens a modal showing detailed information, including images, price, category, description, and additional info (if available).
* **Low Stock Indicator:** Products with 5 or fewer items in stock are marked with a "Low Stock" badge.
* **Order Placement:** Users can initiate an order for a selected product from the product details modal.
* **Order Input Form:** An order modal prompts users to enter the desired quantity, phone number, and delivery address.
* **Order Confirmation:** Upon submitting the order, the data is sent to the `https://admin.refabry.com/api/public/order/create` API.
* **Success/Error Messaging:** Displays a success message upon successful order placement or an error message if the order fails.
* **Loading State:** Shows a skeleton loading UI while product data is being fetched.
* **Smooth Animations:** Uses Framer Motion for subtle hover effects on product cards.
* **Responsive Design:** Built with Flowbite React components, ensuring a responsive layout.

## Technologies Used

* **React:** A JavaScript library for building user interfaces.
* **Flowbite React:** A React component library built on top of Tailwind CSS, providing pre-designed UI elements.
* **Framer Motion:** A motion library for React to create smooth and declarative animations.
* **useEffect:** React Hook for handling side effects like data fetching.
* **useState:** React Hook for managing component state.
* **fetch API:** For making HTTP requests to fetch product data and place orders.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AnantaBG/NewRJobTask.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd <project_directory>
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

4.  **Start the development server:**
    ```bash
    npm start
    # or
    yarn start
    ```

    This will run the application in development mode. Open [http://localhost:3000](http://localhost:5173) to view it in the browser.

## Environment Variables

This project does not require any specific environment variables for basic functionality as the API URLs are hardcoded within the component. However, in a production environment, you might consider storing API URLs in environment variables for security and easier configuration.

## API Endpoints

* **Get Products:** `https://admin.refabry.com/api/all/product/get` (GET request) - Fetches the list of products.
* **Place Order:** `https://admin.refabry.com/api/public/order/create` (POST request) - Submits the order data.

## Components

* **`ProductListingWebsite.js`:** The main component that fetches and displays the products, handles product and order modals, and manages order placement.
* **`ProductCard.js`:** A component responsible for rendering individual product cards in the product listing.
* **`LoadingSkeleton.js`:** A component that displays a placeholder UI while product data is loading.

## Notes

* The delivery charge is currently hardcoded as `$80`. You might want to implement a dynamic delivery charge calculation based on location or other factors.
* The customer name in the order data is currently set to "Guest". You might want to add a name field to the order form.
* The courier is also hardcoded as "steadfast". This could be made dynamic based on user selection or other logic.

## Further Improvements

* Implement pagination for a large number of products.
* Add filtering and sorting options for the product listing.
* Implement user authentication and order history.
* Integrate with a payment gateway for online payments.
* Improve error handling and user feedback.
* Add unit and integration tests.
* Consider using a state management library like Redux or Zustand for more complex applications.

## Author

This project is licensed under the **MIT License**.  

📌 **Developed by [AnantaBG](https://github.com/AnantaBG)** 