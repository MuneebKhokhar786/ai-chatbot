"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { GlobeIcon } from "lucide-react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/source";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";

const MODELS = [
  { name: "GPT 4o", value: "openai/gpt-4o" },
  { name: "Deepseek R1", value: "deepseek/deepseek-r1" },
];

const ChatBotDemo = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(MODELS[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const [isWebSearching, setIsWebSearching] = useState(false);

  const { messages, sendMessage, status } = useChat();

  type MessagePart = {
    type: string;
    text?: string;
    url?: string;
  };

  type Message = {
    id: string;
    role: string;
    parts: MessagePart[];
  };

  const isToolStep = useCallback(
    (message: Message) =>
      message.role === "assistant" &&
      message.parts.every(
        (part) =>
          part.type.startsWith("tool-") || part.type === "step-start"
      ),
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;

      sendMessage(
        { text: input },
        {
          body: { model, webSearch },
        }
      );

      setInput("");
    },
    [input, model, webSearch, sendMessage]
  );


  useEffect(() => {
    if (status === "ready") {
      setIsWebSearching(false);
      return;
    }

    const lastMessage = messages[messages.length - 1] as Message | undefined;
    const searching = lastMessage?.parts.some(
      (part) => part.type === "tool-webSearchTool"
    );

    setIsWebSearching(Boolean(searching));
  }, [status, messages]);

  const modelOptions = useMemo(
    () =>
      MODELS.map(({ name, value }) => (
        <PromptInputModelSelectItem key={value} value={value}>
          {name}
        </PromptInputModelSelectItem>
      )),
    []
  );

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => {
              if (isToolStep(message)) return null;

              return (
                <div key={message.id}>
                  {message.role === "assistant" && (
                    <Sources>
                      {message.parts
                        .filter((part) => part.type === "source-url")
                        .map((part, i, sourceParts) => (
                          <React.Fragment key={`source-${message.id}-${i}`}>
                            {i === 0 && (
                              <SourcesTrigger count={sourceParts.length} />
                            )}
                            <SourcesContent>
                              <Source href={part.url} title={part.url} />
                            </SourcesContent>
                          </React.Fragment>
                        ))}
                    </Sources>
                  )}

                  <Message from={message.role}>
                    <MessageContent>
                      {message.parts.map((part, i) => {
                        if (part.type === "text") {
                          return (
                            <Response key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          );
                        }
                        if (part.type === "reasoning") {
                          return (
                            <Reasoning
                              key={`${message.id}-${i}`}
                              className="w-full"
                              isStreaming={status === "streaming"}
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>{part.text}</ReasoningContent>
                            </Reasoning>
                          );
                        }
                        return null;
                      })}
                    </MessageContent>
                  </Message>
                </div>
              );
            })}

            {(status === "submitted" || isWebSearching) && <Loader />}
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputButton
                variant={webSearch ? "default" : "ghost"}
                onClick={() => setWebSearch((prev) => !prev)}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>

              <PromptInputModelSelect
                onValueChange={setModel}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {modelOptions}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>

            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

export default ChatBotDemo;
