import { NextResponse } from 'next/server';
import { travelChat } from '@/ai/flows/travel-chat';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required.' },
        { status: 400 }
      );
    }

    const result = await travelChat({ message, history });

    return NextResponse.json({ response: result.response });
  } catch (error) {
    console.error('Chat API error', error);
    return NextResponse.json(
      { error: 'Failed to generate response.' },
      { status: 500 }
    );
  }
}
