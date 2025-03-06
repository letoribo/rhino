import { http } from "@hypermode/modus-sdk-as"; 
import * as console from "as-console";
import { JSON } from "json-as";
import { Content, ContentItem, GenerateResponse, GeminiChatOutput } from "./classes"

export function Gemini(instruction: string, message: string): GeminiChatOutput {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  const system_part = new ContentItem(instruction);
  const user_part = new ContentItem(message);
  const system_item = new Content([system_part]);
  const user_item = new Content([user_part]);
  const content = new GenerateResponse(system_item, user_item);
  const parts = JSON.stringify(content); console.log(parts);
  const request = new http.Request(url, {
    method: "POST",
    headers: http.Headers.from([
      ["Content-Type", "application/json"],
    ]),
    body: http.Content.from(parts),
  } as http.RequestOptions);
  const response = http.fetch(request)
  const data = response.json<GeminiChatOutput>(); console.log(data.candidates[0].content.parts[0].text);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch. Received: ${response.status} ${response.statusText}`,
    );
  }

  return new GeminiChatOutput(data.candidates)
}