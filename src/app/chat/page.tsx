'use client';
import { useUser, useCollection } from '@/firebase';
import { collection, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Conversation, UserProfile } from '@/lib/types';

interface PopulatedConversation extends Conversation {
    otherUserName: string;
    otherUserAvatar: string;
}

export default function ChatPage() {
    const { user, firestore, isUserLoading } = useUser();
    const router = useRouter();
    const [populatedConversations, setPopulatedConversations] = useState<PopulatedConversation[]>([]);
    const [areDetailsLoading, setAreDetailsLoading] = useState(true);

    const conversationsQuery = useMemo(() => {
        if (!user || !firestore) return null;
        return query(
            collection(firestore, 'conversations'),
            where('participants', 'array-contains', user.uid),
            orderBy('lastMessageTimestamp', 'desc')
        );
    }, [user, firestore]);

    const { data: conversations, isLoading: areConversationsLoading } = useCollection<Conversation>(conversationsQuery);

    useEffect(() => {
        if (areConversationsLoading || isUserLoading) {
            setAreDetailsLoading(true);
            return;
        }

        if (!user) {
            router.push('/login');
            return;
        }

        if (conversations && firestore) {
            setAreDetailsLoading(true);
            const fetchParticipantDetails = async () => {
                const convosWithDetails = await Promise.all(
                    conversations.map(async (convo) => {
                        const otherUserId = convo.participants.find(p => p !== user.uid);
                        if (!otherUserId) return { ...convo, otherUserName: 'Unknown User', otherUserAvatar: '' };
                        
                        const userDocRef = doc(firestore, 'users', otherUserId);
                        const userDocSnap = await getDoc(userDocRef);
                        
                        if (userDocSnap.exists()) {
                            const userData = userDocSnap.data() as UserProfile;
                            return {
                                ...convo,
                                otherUserName: userData.displayName || 'User',
                                otherUserAvatar: userData.photoURL || '',
                            };
                        }
                        return { ...convo, otherUserName: 'Unknown User', otherUserAvatar: '' };
                    })
                );
                setPopulatedConversations(convosWithDetails);
                setAreDetailsLoading(false);
            };
            fetchParticipantDetails();
        } else {
            setPopulatedConversations([]);
            setAreDetailsLoading(false);
        }
    }, [conversations, firestore, user, isUserLoading, areConversationsLoading, router]);

    if (isUserLoading || areConversationsLoading || areDetailsLoading) {
        return <ChatSkeleton />;
    }

    if (!user) {
        // This case is handled by the useEffect, but as a fallback
        return <ChatSkeleton />;
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
            <header className="mb-8">
                <h1 className="text-4xl font-bold font-headline">My Conversations</h1>
                <p className="text-muted-foreground mt-2">View and manage your chats with other users.</p>
            </header>
            
            <Card>
                <div className="divide-y">
                    {populatedConversations.length > 0 ? (
                        populatedConversations.map((convo) => (
                            <Link href={`/chat/${convo.id}`} key={convo.id} className="block hover:bg-muted/50 transition-colors">
                                <div className="flex items-center p-4 gap-4">
                                    <Avatar className="h-12 w-12 border">
                                        <AvatarImage src={convo.otherUserAvatar} />
                                        <AvatarFallback>{convo.otherUserName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow overflow-hidden">
                                        <div className="flex justify-between items-start">
                                            <h2 className="font-bold truncate">{convo.otherUserName}</h2>
                                            {convo.lastMessageTimestamp && (
                                                <p className="text-xs text-muted-foreground flex-shrink-0 ml-4">
                                                    {formatDistanceToNow(new Date(convo.lastMessageTimestamp?.seconds * 1000), { addSuffix: true })}
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground" />
                            <h2 className="mt-6 text-xl font-semibold">No conversations yet</h2>
                            <p className="mt-2 text-muted-foreground">Contact a seller on a listing page to start a chat.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

function ChatSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
             <header className="mb-8">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-80 mt-4" />
            </header>
            <Card>
                <div className="divide-y">
                    {[...Array(3)].map((_, i) => (
                        <div className="flex items-center p-4 gap-4" key={i}>
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="flex-grow space-y-2">
                                <Skeleton className="h-5 w-1/3" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
