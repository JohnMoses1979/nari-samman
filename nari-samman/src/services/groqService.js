import { sendAiChatMessage } from './api';
import { detectAiIntent } from '../utils/aiIntentDetector';
import { buildAssistantContext, formatAssistantContextPrompt } from './aiKnowledgeService';
import { NARI_AI_SYSTEM_PROMPT } from '../constants/aiSystemPrompt';

const BACKEND_UNAVAILABLE_REPLY = 'I am having trouble reaching the assistant service right now. Please try again in a moment.';

function normalizeMessages(messages) {
  return Array.isArray(messages) ? messages.filter((message) => Boolean(message?.text)) : [];
}

function toBackendRole(role) {
  if (role === 'ai' || role === 'assistant') return 'assistant';
  if (role === 'system') return 'system';
  return 'user';
}

function buildConversationMessages(messages, contextPrompt) {
  const normalized = normalizeMessages(messages).map((message) => ({
    role: toBackendRole(message.role),
    content: String(message.text || '').trim(),
  }));

  return [
    {
      role: 'system',
      content: [NARI_AI_SYSTEM_PROMPT, contextPrompt].filter(Boolean).join('\n\n'),
    },
    ...normalized.filter((message) => message.role !== 'system'),
  ];
}

// Voice-ready pipeline:
// Speech To Text -> chat engine -> Groq -> Text To Speech
// The same sendChatMessage() function can be reused later for voice input.
export async function sendChatMessage(messages = [], options = {}) {
  const safeMessages = normalizeMessages(messages);
  const lastUserMessage = [...safeMessages].reverse().find((message) => message?.role === 'user');
  const queryText = String(lastUserMessage?.text || '').trim();

  if (!queryText) {
    return {
      success: false,
      reply: 'Please type a message first.',
      source: 'frontend',
      mode: 'validation',
    };
  }

  const intent = detectAiIntent(queryText);
  const context = await buildAssistantContext({
    queryText,
    messages: safeMessages,
    intent,
  });
  const contextPrompt = formatAssistantContextPrompt(context);
  const conversationMessages = buildConversationMessages(safeMessages, contextPrompt);

  const payload = {
    conversationId: options.conversationId || null,
    currentScreen: options.currentScreen || 'AI Assistant',
    intent,
    context,
    messages: conversationMessages,
    responseMode: 'conversational',
  };

  try {
    const response = await sendAiChatMessage(payload);

    if (response?.success && response?.reply) {
      return {
        ...response,
        source: 'backend',
        mode: 'assistant',
        intent: intent.intent,
        context,
      };
    }

    return {
      success: false,
      reply: response?.reply || response?.message || response?.error || BACKEND_UNAVAILABLE_REPLY,
      source: 'backend',
      mode: 'assistant',
      intent: intent.intent,
      context,
    };
  } catch (error) {
    return {
      success: false,
      reply: BACKEND_UNAVAILABLE_REPLY,
      message: error?.message,
      source: 'backend',
      mode: 'assistant',
      intent: intent.intent,
      context,
    };
  }
}
