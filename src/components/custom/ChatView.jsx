"use client";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";
import { ArrowRight, X, Loader2 } from "lucide-react";
import axios from "axios";
import Prompt from "@/data/Prompt";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { createContextualPrompt } from "@/utils/contextHelper";

export const countToken = (inputText) => {
  return inputText
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;
};

const ShimmerLoader = () => (
  <div className="animate-pulse">
    <div className="space-y-3">
      <div className="h-4 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted rounded-lg bg-[length:200%_100%] animate-shimmer"></div>
      <div className="h-4 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted rounded-lg bg-[length:200%_100%] animate-shimmer w-3/4"></div>
      <div className="h-4 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted rounded-lg bg-[length:200%_100%] animate-shimmer w-1/2"></div>
    </div>
  </div>
);

function ChatView({ isCodeGenerating }) {
  const { id } = useParams();

  const convex = useConvex();
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const UpdateTokens = useMutation(api.users.UpdateTokens);

  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetails, setUserDetails } = useContext(UserDetailContext);

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentFiles, setCurrentFiles] = useState(null);

  useEffect(() => {
    id && GetWorkspaceData();
  }, [id]);

  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    setMessages(result?.messages);
    setCurrentFiles(result?.fileData || null);
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role === "user") {
        GetAiResponse();
      }
    }
  }, [messages]);

  const GetAiResponse = async () => {
    setLoading(true);
    const PROMPT = createContextualPrompt(
      messages,
      currentFiles,
      Prompt.CHAT_PROMPT
    );

    const result = await axios.post("/api/ai-chat", {
      prompt: PROMPT,
    });

    console.log(result.data.result);

    const aiResp = {
      role: "ai",
      content: result.data.result,
    };

    setMessages((prev) => [...prev, aiResp]);

    await UpdateMessages({
      workspaceId: id,
      messages: [...messages, aiResp],
    });

    const token =
      Number(userDetails?.token) - Number(countToken(JSON.stringify(aiResp)));

    setUserDetails((prev) => ({
      ...prev,
      token: token,
    }));

    await UpdateTokens({
      userId: userDetails?._id,
      token: token,
    });

    setLoading(false);
  };

  const onGenerate = (input) => {
    if (userDetails?.token <= 10) {
      toast("You don't have enough tokens to generate a response.");
      return;
    }

    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setUserInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      onGenerate(userInput);
    }
  };

  return (
    <div className="relative h-screen flex flex-col bg-transparent">
      <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-6 pb-6 pt-[1px]">
          {(Array.isArray(messages) ? messages : []).map((msg, index) => (
            <div key={index}>
              {msg.role === "user" && (
                <div
                  className={`bg-card border border-border/50 rounded-2xl p-4 flex gap-4 ${
                    msg.content.includes("\n") ? "items-start" : "items-center"
                  }`}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 ">
                    <Image
                      src={userDetails?.picture || "/default-avatar.png"}
                      alt="User"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-foreground leading-relaxed">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              )}

              {msg.role === "ai" && (
                <div className="text-foreground leading-relaxed max-w-none px-1.5">
                  <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border prose-pre:border-border/50 prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary/50">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-4 last:mb-0 text-foreground">
                            {children}
                          </p>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-bold mb-4 text-foreground">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl font-semibold mb-3 text-foreground">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-medium mb-3 text-foreground">
                            {children}
                          </h3>
                        ),
                        code: ({ children }) => (
                          <code className="px-2 py-1 bg-muted border border-border/50 rounded text-sm text-foreground">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="p-4 bg-muted border border-border/50 rounded-lg overflow-x-auto text-sm mb-4">
                            {children}
                          </pre>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc ml-6 mb-4 space-y-1">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal ml-6 mb-4 space-y-1">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-foreground">{children}</li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground mb-4">
                            {children}
                          </blockquote>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-foreground">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-foreground">{children}</em>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="text-foreground leading-relaxed max-w-none">
              <ShimmerLoader />
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-[#101010]/60 border-t border-border/30 p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="relative backdrop-blur-md bg-card/50 border border-border/50 rounded-2xl shadow-lg shadow-black/5 hover:border-border/80 focus-within:shadow-primary/10 transition-all duration-300">
            <textarea
              placeholder={"Let me know what's missing ..."}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full h-24 resize-none bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base leading-relaxed px-4 py-3 pr-12 rounded-2xl scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#09706A #0000",
              }}
              disabled={loading}
            />

            <div className="absolute bottom-3 right-3 mr-2">
              <button
                onClick={() => onGenerate(userInput)}
                disabled={!userInput.trim() || loading || isCodeGenerating}
                className="inline-flex items-center justify-center w-8 h-8 bg-primary hover:bg-primary/90 disabled:bg-muted/50 disabled:text-muted-foreground text-primary-foreground rounded-lg transition-all duration-200 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 group"
                title="Send message (Ctrl + Enter)"
              >
                {isCodeGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200 " />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
