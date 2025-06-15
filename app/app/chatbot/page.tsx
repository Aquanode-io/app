"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Paperclip,
  ArrowUp,
  Bot,
  User,
  ExternalLink,
  Server,
  Loader2,
  MessageSquare,
  Github,
  Globe,
  Zap,
} from "lucide-react";
import { getChatHistory, sendChatMessage } from "@/hooks/service";
import { ChatMessage } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "../../../components/ui/badge";
import {
  Container,
  Heading,
  Text,
  Card as DSCard,
  Grid,
} from "@/components/ui/design-system";

// Updated interfaces
interface DeploymentInfo {
  repoUrl: string;
  branchName: string;
  cpuUnits: number;
  memorySize: string;
  storageSize: string;
  port?: number;
  appUrl?: string;
}

interface DeploymentError {
  error: string;
}

// Suggestive prompts
const SUGGESTED_PROMPTS = [
  {
    icon: Github,
    text: "Deploy a Node.js app from GitHub",
    prompt: "I want to deploy a Node.js application from my GitHub repository",
  },
  // {
  //   icon: Globe,
  //   text: "Deploy a React frontend",
  //   prompt: "Help me deploy a React frontend application",
  // },
  {
    icon: Server,
    text: "Deploy a Python API",
    prompt: "I need to deploy a Python Flask/FastAPI backend",
  },
  // {
  //   icon: Zap,
  //   text: "What deployment options do I have?",
  //   prompt:
  //     "What are the different deployment options and configurations available?",
  // },
];

// Extract deployment data from special tags in the message
const extractDeploymentData = (
  content: string
): {
  status: "pending" | "complete" | "error" | null;
  data: DeploymentInfo | DeploymentError | null;
} => {
  // Check for pending deployment
  const pendingMatch = content.match(
    /<DEPLOYMENT_PENDING>([\s\S]*?)<\/DEPLOYMENT_PENDING>/
  );
  if (pendingMatch) {
    try {
      return {
        status: "pending",
        data: JSON.parse(pendingMatch[1]) as DeploymentInfo,
      };
    } catch (e) {
      console.error("Failed to parse pending deployment data:", e);
    }
  }

  // Check for completed deployment
  const completeMatch = content.match(
    /<DEPLOYMENT_COMPLETE>([\s\S]*?)<\/DEPLOYMENT_COMPLETE>/
  );
  if (completeMatch) {
    try {
      return {
        status: "complete",
        data: JSON.parse(completeMatch[1]) as DeploymentInfo,
      };
    } catch (e) {
      console.error("Failed to parse complete deployment data:", e);
    }
  }

  // Check for deployment error
  const errorMatch = content.match(
    /<DEPLOYMENT_ERROR>([\s\S]*?)<\/DEPLOYMENT_ERROR>/
  );
  if (errorMatch) {
    try {
      return {
        status: "error",
        data: JSON.parse(errorMatch[1]) as DeploymentError,
      };
    } catch (e) {
      console.error("Failed to parse deployment error data:", e);
    }
  }

  return { status: null, data: null };
};

// Remove deployment tags from message for display
const cleanMessageContent = (content: string): string => {
  return content
    .replace(/<DEPLOYMENT_PENDING>[\s\S]*?<\/DEPLOYMENT_PENDING>/g, "")
    .replace(/<DEPLOYMENT_COMPLETE>[\s\S]*?<\/DEPLOYMENT_COMPLETE>/g, "")
    .replace(/<DEPLOYMENT_ERROR>[\s\S]*?<\/DEPLOYMENT_ERROR>/g, "")
    .trim();
};

// Deployment status card component
const DeploymentStatusCard = ({
  status,
  data,
}: {
  status: "pending" | "complete" | "error";
  data: DeploymentInfo | DeploymentError;
}) => {
  if (status === "pending") {
    const depInfo = data as DeploymentInfo;
    return (
      <Card className="mt-3 border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Loader2 size={16} className="text-primary animate-spin" />
            Deployment in Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Repository:</span>
            <Link
              href={depInfo.repoUrl}
              target="_blank"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              {depInfo.repoUrl.replace(
                /(https?:\/\/)?(www\.)?(github|gitlab)\.com\//,
                ""
              )}
              <ExternalLink size={10} />
            </Link>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Branch:</span>
            <span>{depInfo.branchName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Resources:</span>
            <span>
              {depInfo.cpuUnits} CPU{depInfo.cpuUnits > 1 ? "s" : ""},{" "}
              {depInfo.memorySize} RAM, {depInfo.storageSize} Storage
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <Badge
              variant="outline"
              className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 text-xs"
            >
              <Loader2 size={10} className="mr-1 animate-spin" />
              Processing
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  } else if (status === "complete") {
    const depInfo = data as DeploymentInfo;
    return (
      <Card className="mt-3 border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Server size={16} className="text-primary" />
            Deployment Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Repository:</span>
            <Link
              href={depInfo.repoUrl}
              target="_blank"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              {depInfo.repoUrl.replace(
                /(https?:\/\/)?(www\.)?(github|gitlab)\.com\//,
                ""
              )}
              <ExternalLink size={10} />
            </Link>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Branch:</span>
            <span>{depInfo.branchName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Resources:</span>
            <span>
              {depInfo.cpuUnits} CPU{depInfo.cpuUnits > 1 ? "s" : ""},{" "}
              {depInfo.memorySize} RAM, {depInfo.storageSize} Storage
            </span>
          </div>
          {depInfo.appUrl && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">App URL:</span>
              <Link
                href={depInfo.appUrl}
                target="_blank"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                View App <ExternalLink size={10} />
              </Link>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 text-xs"
            >
              <Server size={10} className="mr-1" />
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  } else if (status === "error") {
    const depError = data as DeploymentError;
    return (
      <Card className="mt-3 border-destructive/20 bg-destructive/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm text-destructive">
            <MessageSquare size={16} />
            Deployment Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs">
          <Text variant="small" className="text-destructive">
            {depError.error}
          </Text>
        </CardContent>
      </Card>
    );
  }
};

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const loadChatHistory = useCallback(async () => {
    try {
      const history = await getChatHistory();
      if (history.length > 0) {
        setMessages(history);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  }, []);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  useEffect(() => {
    // Only scroll the message container, not the entire page
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.closest(".overflow-y-auto");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const userMessage: ChatMessage = {
        role: "user",
        content: `File attached: ${files[0].name}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      // TODO: Implement file upload functionality
      toast({
        title: "File Upload",
        description: "File upload functionality coming soon!",
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendPrompt();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const sendPrompt = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Create a temporary assistant message that will be updated
    const tempAssistantMessage: ChatMessage = {
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };

    // Add the assistant message to the state
    setMessages((prev) => [...prev, tempAssistantMessage]);

    try {
      // Create a local reference to track content to avoid state closure issues
      let currentContent = "";

      await sendChatMessage(
        {
          messages: [...messages, userMessage],
        },
        (chunk) => {
          // Accumulate content locally to avoid state closure issues
          currentContent += chunk;

          // Update the last message with the complete content so far
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === "assistant") {
              // Replace the content entirely instead of appending
              lastMessage.content = currentContent;
            }
            return newMessages;
          });
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });

      // Remove the assistant message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const showSuggestedPrompts = messages.length <= 1;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Container variant="wide" className="space-dashboard">
        {/* Header */}
        <div className="space-element">
          <Heading level={1} className="space-tight">
            Agent Terminal
          </Heading>
          <Text variant="base" muted>
            Deploy apps in seconds using our AI agent. Paste a GitHub repo and
            let us handle the rest.
          </Text>
        </div>

        {/* Chat Container */}
        <DSCard variant="primary" className="space-component">
          {/* Messages Area */}
          <div className="h-[65vh] overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => {
                const deploymentData =
                  message.role === "assistant"
                    ? extractDeploymentData(message.content)
                    : { status: null, data: null };

                const displayContent =
                  message.role === "assistant"
                    ? cleanMessageContent(message.content)
                    : message.content;

                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                        <Bot size={14} />
                      </div>
                    )}

                    <div
                      className={`rounded-lg px-3 py-2 max-w-[80%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/40 text-foreground"
                      }`}
                    >
                      <Text
                        variant="base"
                        className="leading-relaxed whitespace-pre-wrap"
                        as="div"
                      >
                        {displayContent}
                      </Text>
                      <Text
                        variant="caption"
                        className="opacity-60 space-tight"
                        as="span"
                      >
                        {new Date(message.timestamp || "").toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Text>

                      {/* Deployment Status Card */}
                      {deploymentData.status && deploymentData.data && (
                        <DeploymentStatusCard
                          status={deploymentData.status}
                          data={deploymentData.data}
                        />
                      )}
                    </div>

                    {message.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-secondary/40 flex items-center justify-center text-foreground/80 flex-shrink-0">
                        <User size={14} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Suggested Prompts */}
              {showSuggestedPrompts && (
                <div className="flex flex-col items-center space-y-3 py-6">
                  <Text variant="small" muted className="space-tight">
                    Try these suggestions:
                  </Text>
                  <Grid variant="responsive-2" className="w-full max-w-4xl">
                    {SUGGESTED_PROMPTS.map((suggestion, index) => {
                      const Icon = suggestion.icon;
                      return (
                        <button
                          key={index}
                          onClick={() =>
                            handleSuggestedPrompt(suggestion.prompt)
                          }
                          className="flex items-center gap-3 p-3 rounded-lg border border-border/30 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/30 transition-all duration-200 text-left text-sm"
                          disabled={isLoading}
                        >
                          <Icon
                            size={16}
                            className="text-primary flex-shrink-0"
                          />
                          <Text variant="small" className="text-foreground">
                            {suggestion.text}
                          </Text>
                        </button>
                      );
                    })}
                  </Grid>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-border/20 p-4">
            <div className="flex items-center gap-2 bg-background border border-border/30 rounded-lg p-2 hover:border-primary/20 transition-colors max-w-4xl mx-auto">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <button
                onClick={handlePaperclipClick}
                className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                disabled={isLoading}
              >
                <Paperclip size={16} />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent text-base focus:outline-none placeholder-muted-foreground py-2 px-1"
                disabled={isLoading}
              />

              <button
                onClick={sendPrompt}
                className={`p-1.5 rounded-md transition-all ${
                  input.trim() && !isLoading
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground bg-secondary/30 cursor-not-allowed"
                }`}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ArrowUp size={16} />
                )}
              </button>
            </div>
          </div>
        </DSCard>
      </Container>
    </div>
  );
};

export default ChatInterface;
