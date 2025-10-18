'use client';
import { useUser, useCollection, useDoc } from '@/firebase';
import { collection, doc, query, orderBy, addDoc, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage, Conversation, UserProfile } from '@/lib/types';

interface ConversationHeader {
    otherUserName: string;
    otherUserAvatar: string;
}

export default function ConversationPage({ params }: { params: { conversationId: string } }) {
    const { user, firestore, isUserLoading } = useUser();
    const router = useRouter();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [headerData, setHeaderData] = useState<ConversationHeader | null>(null);

    const conversationRef = useMemo(() => {
        if (!firestore) return null;
        return doc(firestore, 'conversations', params.conversationId);
    }, [firestore, params.conversationId]);

    const { data: conversation, isLoading: isConversationLoading } = useDoc<Conversation>(conversationRef);

    const messagesQuery = useMemo(() => {
        if (!conversationRef) return null;
        return query(collection(conversationRef, 'messages'), orderBy('timestamp', 'asc'));
    }, [conversationRef]);

    const { data: messages, isLoading: areMessagesLoading } = useCollection<ChatMessage>(messagesQuery);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (conversation && firestore && user) {
            const otherUserId = conversation.participants.find(p => p !== user.uid);
            if (otherUserId) {
                const userDocRef = doc(firestore, 'users', otherUserId);
                getDoc(userDocRef).then(docSnap => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data() as UserProfile;
                        setHeaderData({
                            otherUserName: userData.displayName || 'User',
                            otherUserAvatar: userData.photoURL || '',
                        });
                    }
                });
            }
        }
    }, [conversation, firestore, user]);

    if (!isUserLoading && user && !isConversationLoading && conversation && !conversation.participants.includes(user.uid)) {
        // User is not part of this conversation
        router.replace('/chat');
        return null;
    }
    
    const handleSendMessage = async () => {
        if (!firestore || !user || !conversationRef || newMessage.trim() === '') return;

        const messagesCollection = collection(conversationRef, 'messages');
        const messageData = {
            senderId: user.uid,
            text: newMessage,
            timestamp: serverTimestamp(),
        };

        try {
            await addDoc(messagesCollection, messageData);
            
            await updateDoc(conversationRef, {
                lastMessage: newMessage,
                lastMessageTimestamp: serverTimestamp(),
            });

            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
            // Optionally show a toast notification
        }
    };
    
    const isLoading = isUserLoading || isConversationLoading || areMessagesLoading || !headerData;

    return (
        <div className="h-full flex flex-col">
            <header className="sticky top-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-10">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/chat')}>
                        <ArrowLeft />
                    </Button>
                    {isLoading ? (
                        <>
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-6 w-32" />
                        </>
                    ) : (
                        <>
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={headerData.otherUserAvatar} />
                                <AvatarFallback>{headerData.otherUserName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-lg font-bold">{headerData.otherUserName}</h2>
                        </>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-16 w-3/4" />
                        <Skeleton className="h-16 w-3/4 ml-auto" />
                        <Skeleton className="h-16 w-3/4" />
                    </div>
                ) : (
                    messages?.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                'flex items-end gap-2',
                                message.senderId === user?.uid ? 'justify-end' : 'justify-start'
                            )}
                        >
                            <div
                                className={cn(
                                    'max-w-md rounded-lg px-4 py-2',
                                    message.senderId === user?.uid
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                )}
                            >
                                <p>{message.text}</p>
                            </div>
                        </div>
                    ))
                )}
                 <div ref={messagesEndRef} />
            </main>

            <footer className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4">
                <div className="container mx-auto max-w-4xl">
                     <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            autoComplete="off"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading || !newMessage.trim()}>
                            <Send />
                        </Button>
                    </form>
                </div>
            </footer>
        </div>
    );
}
