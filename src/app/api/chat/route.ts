import { NextResponse } from 'next/server';
import { travelChat } from '@/ai/flows/travel-chat';
import { createRequestId, errorToMeta, logger } from '@/lib/logger';

export async function POST(req: Request) {
  const requestId = createRequestId();
  const startedAt = Date.now();

  try {
    const body = await req.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body.history) ? body.history : [];

    logger.info('Chat API request received.', {
      requestId,
      messageLength: message.length,
      historyCount: history.length,
    });

    if (!message) {
      logger.warn('Chat API request rejected: missing message.', {
        requestId,
      });
      return NextResponse.json(
        { error: 'Message is required.' },
        { status: 400 }
      );
    }

    const result = await travelChat({ message, history });

    logger.info('Chat API request completed.', {
      requestId,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json({ response: result.response });
  } catch (error) {
    logger.error('Chat API error.', {
      requestId,
      durationMs: Date.now() - startedAt,
      ...errorToMeta(error),
    });
    return NextResponse.json(
      { error: 'Failed to generate response.' },
      { status: 500 }
    );
  }
}
