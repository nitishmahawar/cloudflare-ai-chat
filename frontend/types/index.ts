export interface SuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T;
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
  updatedAt: Date;
}
