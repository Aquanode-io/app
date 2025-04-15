import { getProviderFromEnv } from "@/lib/utils";
import {
  GetDeploymentsRequest,
  GetDeploymentsResponse,
  Deployment,
  ServiceType,
  ProviderType,
  ChatRequest,
  ChatResponse,
  ChatMessage,
} from "./types";
import { CreateDeploymentSchemaType } from "@/lib/schemas/deployment";
import { DeploymentResult } from "./types";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3080";

// User response interface
interface UserResponse {
  message: string;
  user: number;
}

// Paginated response interface
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Token management
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

// Basic request function
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An unknown error occurred" }));
    throw new Error(error.message || "An error occurred");
  }

  return response.json();
}

// User Management
export async function createUser(address: string): Promise<UserResponse> {
  return request<UserResponse>("/api/user/register", {
    method: "POST",
    body: JSON.stringify({ address }),
  });
}

export async function createDeploymentNew(
  data: CreateDeploymentSchemaType
): Promise<DeploymentResult> {
  return request<DeploymentResult>("/api/deployments/deploy", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Deployment Services
export async function getUserDeployments(
  user: string,
  type?: ServiceType,
  provider?: ProviderType
): Promise<Deployment[]> {
  return request<GetDeploymentsResponse>("/api/deployments/user", {
    method: "POST",
    body: JSON.stringify({
      user,
      type: type || null,
      provider: provider || null,
    } as GetDeploymentsRequest),
  }).then((response) => {
    return response.deployments;
  });
}

// Get deployment by ID
export async function getDeploymentById(deploymentId: number): Promise<Deployment> {
  return request<Deployment>(`/api/deployments/${deploymentId}`);
}

// Get service instances by type
export async function getServiceInstances(type: string): Promise<any[]> {
  return request<any[]>("/api/deployments/service-instances", {
    method: "POST",
    body: JSON.stringify({ type }),
  });
}

// Close a deployment
export async function closeDeployment(deploymentId: number): Promise<void> {
  return request<void>("/api/deployments/close", {
    method: "POST",
    body: JSON.stringify({ deploymentId }),
  });
}

// Get user deployments by type
export async function getUserDeploymentsByType(
  userId: string,
  type: string,
  provider?: ProviderType
): Promise<Deployment[]> {
  return request<Deployment[]>("/api/deployments/user", {
    method: "POST",
    body: JSON.stringify({
      userId,
      type,
      provider: provider || null,
    }),
  });
}

// AI Chat Services
export async function sendChatMessage(
  chatRequest: ChatRequest,
  onStream?: (text: string) => void
): Promise<ChatResponse> {
  if (onStream) {
    // Streaming request
    const response = await fetch(`${API_BASE_URL}/api/ai/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && {
          Authorization: `Bearer ${accessToken}`,
        }),
      },
      body: JSON.stringify({
        ...chatRequest,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "An unknown error occurred" }));
      throw new Error(error.message || "An error occurred");
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    // Process the stream using the ReadableStream API
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let accumulatedText = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete lines in the buffer
        const lines = buffer.split("\n");
        // Keep the last potentially incomplete line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.substring(6).trim();

            if (data === "[DONE]") {
              return { text: accumulatedText };
            }

            // Skip empty data
            if (!data) {
              continue;
            }

            try {
              // Ensure we're parsing valid JSON
              const parsed = JSON.parse(data);
              if (parsed.choices && parsed.choices[0]) {
                const deltaContent = parsed.choices[0]?.delta?.content || "";
                if (deltaContent) {
                  accumulatedText += deltaContent;
                  onStream(deltaContent);
                }
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e, data);
              // Continue processing other chunks instead of breaking
              continue;
            }
          }
        }
      }
    } catch (error) {
      console.error("Stream reading error:", error);
      throw error;
    } finally {
      reader.releaseLock();
    }

    return { text: accumulatedText };
  } else {
    // Non-streaming request
    return request<ChatResponse>("/api/ai/chat/completions", {
      method: "POST",
      body: JSON.stringify({
        ...chatRequest,
        stream: false,
      }),
    });
  }
}

export async function getChatHistory(): Promise<ChatMessage[]> {
  // Since the backend doesn't have a history endpoint yet,
  // we'll return an empty array for now
  return [];
}

export async function clearChatHistory(): Promise<void> {
  // Since the backend doesn't have a clear history endpoint yet,
  // we'll do nothing for now
  return;
}

export async function getGPUCredits(): Promise<{ credits: number }> {
  return request<{ credits: number }>("/credits");
}

// Get paginated deployments
export async function getPaginatedDeployments(
  userId: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Deployment>> {
  return request<PaginatedResponse<Deployment>>(
    `/api/deployments/paginated?userId=${userId}&page=${page}&limit=${limit}`
  );
}