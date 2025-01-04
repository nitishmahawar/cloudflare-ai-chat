import { z } from "zod";

const messageSchema = z.object({
  content: z.string(),
  role: z.enum(["user", "assistant"]),
});

export const chatSchema = z.object({
  conversationId: z.string({ required_error: "Conversation Id is required!" }),
  messages: z.array(messageSchema, {
    required_error: "Messages are required!",
  }),
});

export const getConversationsSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce
    .number()
    .max(50, { message: "Limit must be less than 50!" })
    .default(20),
});

export const patchConversationSchema = z.object({
  title: z
    .string({ required_error: "Title is required!" })
    .min(4, { message: "Title must be at least 4 character long!" })
    .max(200, { message: "Title must be less than 200 character!" }),
});
