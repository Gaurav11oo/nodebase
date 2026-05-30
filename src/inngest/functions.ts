// // src/inngest/functions.ts

import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: { event: "app/hello.created" } },
  async ({ event, step }) => {
    const result = await step.run("hello-world", async () => {
      return { processed: true, id: event.data.email };
    });
    //Fetching Youtube Video
    await step.sleep("fetching", "5s");
    //Transcription Video
    await step.sleep("transcribing", "5s");
    //Sending Transcription to OpenAI
    await step.sleep("sending-to-ai", "5s");

    await step.run("craete-workflow", () => {
      return prisma.workflow.create({
        data: {
          name: "workflow-from-ingest",
        },
      });
    });
  }
);
