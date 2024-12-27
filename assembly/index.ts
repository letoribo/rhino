import { models } from "@hypermode/modus-sdk-as";
import { EmbeddingsModel } from "@hypermode/modus-sdk-as/models/experimental/embeddings";
import { Message } from "./classes";
import * as console from "as-console";
import { http } from "@hypermode/modus-sdk-as";

export function Discord(q: string, channel_id: string, message_id: string): Message[] {
  const url = `https://discord.com/api/v10/channels/${channel_id}/messages`

  const response = http.fetch(url)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch messages. Received: ${response.status} ${response.statusText}`,
    );
  }

  return response.json<Message[]>()
}

export function genEmbs(texts: string[]): f32[][] {
  console.log(texts[0]);
  const model = models.getModel<EmbeddingsModel>("text-generator");
  const input = model.createInput(texts);
  const output = model.invoke(input);
  return output.predictions;
}

