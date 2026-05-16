'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2, MessageCircle, Send, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const HIDDEN_ROUTES = new Set(['/login', '/signup']);

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm your TravelSync assistant. Ask me to plan a trip, suggest destinations, or organize your itinerary.",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const canRender = useMemo(() => {
    if (!pathname) return true;
    return !HIDDEN_ROUTES.has(pathname);
  }, [pathname]);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: trimmed },
    ];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages
            .filter(message => message.role !== 'assistant' || message.content)
            .slice(-12),
        }),
      });

      if (!res.ok) {
        throw new Error('Chat request failed.');
      }

      const data = await res.json();
      const responseText =
        typeof data.response === 'string'
          ? data.response
          : 'Sorry, I could not generate a response.';

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: responseText },
      ]);
    } catch (error) {
      console.error('Chat error', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I ran into an issue connecting to the AI. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  if (!canRender) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <Card className="mb-3 w-[320px] overflow-hidden border-border/60 bg-background/95 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/15 p-2 text-primary">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">TravelSync AI</p>
                <p className="text-xs text-muted-foreground">
                  Your travel planning copilot
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="px-4 py-3">
            <ScrollArea className="h-64">
              <div className="flex flex-col gap-3 pr-3">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                      message.role === 'user'
                        ? 'ml-auto bg-primary text-primary-foreground'
                        : 'bg-secondary/70 text-foreground'
                    )}
                  >
                    {message.content}
                  </div>
                ))}
                {isSending && (
                  <div className="mr-auto flex items-center gap-2 rounded-2xl bg-secondary/70 px-3 py-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>
          <div className="border-t border-border/60 px-4 py-3">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={event => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about destinations, budgets, or itineraries..."
                className="min-h-[44px] resize-none"
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isSending}
                aria-label="Send message"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for a new line.
            </p>
          </div>
        </Card>
      )}

      <Button
        className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-300 text-white shadow-lg transition-transform hover:scale-105"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    </div>
  );
}
