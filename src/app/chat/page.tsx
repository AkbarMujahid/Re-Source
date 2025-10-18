'use client';
import { useUser, useCollection } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Frown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Conversation } from '@/lib/types';

export default function ChatPage() {
    const { user, firestore, isUserLoading } = useUser();
    const router = useRouter();

    const conversationsQuery = useMemo(() => {
        if (!user || !firestore) return null;
        return query(
            collection(firestore, 'conversations'),
            where('participants', 'array-contains', user.uid),
            orderBy('lastMessageTimestamp', 'desc')
        );
    }, [user, firestore]);

    const { data: conversations, isLoading } = useCollection<Conversation>(conversationsQuery);

    if (isUserLoading || isLoading) {
        return <ChatSkeleton />;
    }

    if (!user) {
        router.push('/login');
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
                    {conversations && conversations.length > 0 ? (
                        conversations.map((convo) => (
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
                                                    {formatDistanceToNow(convo.lastMessageTimestamp.toDate(), { addSuffix: true })}
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

    