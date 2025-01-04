import { auth } from "@/middlewares/auth";
import { Bindings, SuccessResponse, Variables } from "@/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import {
  chatSchema,
  getConversationsSchema,
  patchConversationSchema,
} from "./schema";
import { streamText, generateObject } from "ai";
import { createWorkersAI } from "workers-ai-provider";
import { z } from "zod";
import { createGroq } from "@ai-sdk/groq";
import { defaultHook } from "@/lib/default-hook";

const app = new Hono<{ Variables: Variables; Bindings: Bindings }>()
  .use("*", auth)
  .post("/", zValidator("json", chatSchema, defaultHook), async (c) => {
    const prisma = c.get("prisma");
    const user = c.get("user");
    const { conversationId, messages } = c.req.valid("json");

    // const workersai = createWorkersAI({ binding: c.env.AI });

    // const model = workersai("@cf/meta/llama-3.3-70b-instruct-fp8-fast");

    const groq = createGroq({ apiKey: c.env.GROQ_API_KEY });
    const model = groq("llama-3.3-70b-versatile");

    const lastUserMessage = messages
      .filter((message) => message.role === "user")
      .pop();

    if (!lastUserMessage) {
      throw new HTTPException(400, { message: "User message not found!" });
    }

    let conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      const { object } = await generateObject({
        model,
        schema: z.object({
          title: z.string().describe("Title of conversation"),
        }),
        system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
        prompt: lastUserMessage.content,
      });
      conversation = await prisma.conversation.create({
        data: { id: conversationId, title: object.title, userId: user.id },
      });
    }

    const result = streamText({
      model,
      messages,
      async onFinish(event) {
        await Promise.all([
          prisma.message.create({
            data: {
              conversationId: conversation.id,
              role: "user",
              content: lastUserMessage.content,
            },
          }),
          prisma.message.create({
            data: {
              conversationId: conversation.id,
              role: "assistant",
              content: event.text,
            },
          }),
        ]);
      },
    });

    return result.toDataStreamResponse({
      headers: {
        "x-conversation-id": conversation.id,
        // "Content-Type": "text/x-unknown",
        // "content-encoding": "identity",
        // "transfer-encoding": "chunked",
      },
    });
  })
  .get(
    "/conversations",
    zValidator("query", getConversationsSchema, defaultHook),
    async (c) => {
      const prisma = c.get("prisma");
      const user = c.get("user");
      const { page, limit } = c.req.valid("query");

      const [totalConversationCount, conversations] = await Promise.all([
        prisma.conversation.count({ where: { userId: user.id } }),
        prisma.conversation.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: (page - 1) * limit,
        }),
      ]);

      return c.json<
        SuccessResponse & {
          pagination: { totalPages: number; totalItems: number; page: number };
        }
      >({
        success: true,
        data: conversations,
        pagination: {
          page,
          totalPages: Math.ceil(totalConversationCount / limit),
          totalItems: totalConversationCount,
        },
        message: "Conversation fetched!",
      });
    }
  )
  .get("/conversations/:id", async (c) => {
    const prisma = c.get("prisma");
    const user = c.get("user");
    const id = c.req.param("id");

    const conversation = await prisma.conversation.findUnique({
      where: { id, userId: user.id },
    });

    if (!conversation) {
      throw new HTTPException(404, { message: "Conversation not found!" });
    }

    return c.json<SuccessResponse>({
      success: true,
      data: conversation,
      message: "Conversation fetched!",
    });
  })
  .patch(
    "/conversations/:id",
    zValidator("json", patchConversationSchema, defaultHook),
    async (c) => {
      const prisma = c.get("prisma");
      const user = c.get("user");
      const id = c.req.param("id");
      const { title } = c.req.valid("json");

      const conversation = await prisma.conversation.findUnique({
        where: { id, userId: user.id },
      });

      if (!conversation) {
        throw new HTTPException(404, { message: "Conversation not found!" });
      }

      const updatedConversation = await prisma.conversation.update({
        where: { userId: user.id, id },
        data: { title },
      });

      return c.json<SuccessResponse>({
        success: true,
        data: updatedConversation,
        message: "Conversation updated!",
      });
    }
  )
  .delete("/conversations/:id", async (c) => {
    const prisma = c.get("prisma");
    const user = c.get("user");
    const id = c.req.param("id");

    const conversation = await prisma.conversation.findUnique({
      where: { id, userId: user.id },
    });

    if (!conversation) {
      throw new HTTPException(404, { message: "Conversation not found!" });
    }

    await prisma.conversation.delete({ where: { id } });

    return c.json<SuccessResponse>({
      success: true,
      data: conversation,
      message: "Conversation deleted!",
    });
  })
  .get("/conversations/:id/messages", async (c) => {
    const prisma = c.get("prisma");
    const user = c.get("user");
    const id = c.req.param("id");

    const conversation = await prisma.conversation.findUnique({
      where: { id, userId: user.id },
    });

    if (!conversation) {
      throw new HTTPException(404, { message: "Conversation not found!" });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
    });

    return c.json<SuccessResponse>({
      success: true,
      data: messages,
      message: "Messages fetched!",
    });
  });

export default app;
