// // src/inngest/functions.ts

import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { create } from "domain";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
  { id: "execute-ai", triggers: { event: "execute/ai" } },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s");

    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 6 ?",
      }
    );

    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openai("gpt-4"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 8 ?",
      }
    );

    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic("claude-sonnet-4-5"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 10 ?",
      }
    );

    return {
      geminiSteps,
      anthropicSteps,
      openaiSteps,
    };
  }
);

// const result = await step.run("hello-world", async () => {
//       return { processed: true, id: event.data.email };
//     });
//     //Fetching Youtube Video
//     await step.sleep("fetching", "5s");
//     //Transcription Video
//     await step.sleep("transcribing", "5s");
//     //Sending Transcription to OpenAI
//     await step.sleep("sending-to-ai", "5s");

//     await step.run("craete-workflow", () => {
//       return prisma.workflow.create({
//         data: {
//           name: "workflow-from-ingest",
//         },
//       });
//     });
