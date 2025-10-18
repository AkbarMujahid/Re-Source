export type Listing = {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  department: string;
  semester: string;
  price: number;
  imageUrl: string;
  isApproved: boolean;
  sellerName?: string;
  sellerAvatarUrl?: string;
  imageHint?: string;
  createdAt: any; // Firestore ServerTimestamp
};

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: any; // Can be Date or Firestore ServerTimestamp
};

export type Report = {
  id: string;
  listingId: string;
  reporterId: string;
  reason: string;
  summary: string;
  status: 'pending' | 'resolved';
};

export type Conversation = {
    id: string;
    participants: string[];
    // We'll also store denormalized data about the other participant for easy display
    otherUserName: string;
    otherUserAvatar: string;
    lastMessage: string;
    lastMessageTimestamp: any; // Firestore ServerTimestamp
};

export type ChatMessage = {
    id: string;
    senderId: string;
    text: string;
    timestamp: any; // Firestore ServerTimestamp
};

    