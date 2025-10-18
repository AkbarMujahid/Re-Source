# **App Name**: Re-Source

## Core Features:

- User Authentication: Secure user registration and login with email verification restricted to @sce.edu.in addresses, using Firebase Authentication.
- Listing Management: Allow students to list, browse, and request academic resources, including title, description, category, department, semester, and price, with image uploads to Firebase Storage.
- Admin Panel: Provide an admin panel for managing users and listings, including blocking/deleting users and approving/deleting listings. Access is restricted to the first registered user, as well as any other subsequently designated admins.
- Internal Chat: Implement a secure chat feature between buyers and sellers, storing message history in Firestore.
- Wishlist: Allow users to save listings to a personal wishlist.
- AI-Powered Recommendations: Use AI to analyze user behavior and listing data to provide personalized resource recommendations, enhancing the relevance of suggestions.
- Reporting Tool: Allow users to flag inappropriate content using an integrated reporting tool. An LLM reviews the flagged listings or users and generates a summary report for admin consideration, enhancing moderation efficiency.

## Style Guidelines:

- Primary color: Vibrant blue (#29ABE2) to convey trust and reliability.
- Background color: Light blue (#E0F7FA) for a clean, uncluttered feel.
- Accent color: Yellow-orange (#F9A825) for calls to action and important notifications.
- Body and headline font: 'PT Sans', a humanist sans-serif for a balance of modernity and warmth.
- Use clear and consistent icons to represent categories and actions, enhancing usability.
- Employ a clean, responsive layout that adapts to different screen sizes, ensuring accessibility on desktop, tablet, and mobile devices.
- Incorporate subtle animations for loading and transitions to improve the user experience and provide visual feedback.