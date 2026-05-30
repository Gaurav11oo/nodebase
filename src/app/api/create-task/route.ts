// // src/app/api/create-task/route.ts
import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST() {
  await inngest.send({
    name: "app/hello.created",
    data: { email: "mark@gmail.com" },
  });

  return NextResponse.json({ message: "Event sent" });
}