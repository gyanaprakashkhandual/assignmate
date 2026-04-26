"use client";

import { IChatMessageResponse, IPreviewResult } from "../../../lib/types/chat.types";
import MessageBubble from "./Message.bubble";

interface MessagePairProps {
  userMessage: IChatMessageResponse;
  aiMessage?: IChatMessageResponse;
  isRenderingPreview: boolean;
  previewResult: IPreviewResult | null;
  onRenderPreview: (messageId: string, chatSessionId: string) => void;
}

export default function MessagePair({
  userMessage,
  aiMessage,
  isRenderingPreview,
  previewResult,
  onRenderPreview,
}: MessagePairProps) {
  return (
    <div className="border-b border-black/4 dark:border-white/4 last:border-0 py-2">
      <MessageBubble
        message={userMessage}
        isRenderingPreview={false}
        previewResult={null}
        onRenderPreview={() => {}}
      />
      {aiMessage && (
        <MessageBubble
          message={aiMessage}
          isRenderingPreview={isRenderingPreview}
          previewResult={previewResult}
          onRenderPreview={onRenderPreview}
        />
      )}
    </div>
  );
}