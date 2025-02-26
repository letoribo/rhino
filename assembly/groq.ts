import { http } from "@hypermode/modus-sdk-as";
import * as console from "as-console";
import { JSON } from "json-as";
import { ChatMessage, ChatCompletion } from "./classes";
import { OpenAIChatOutput } from "@hypermode/modus-sdk-as/models/openai/chat";
//import { message_post } from "./discord";

export function Groq(message: string): string {
  const url = `https://api.groq.com/openai/v1/chat/completions`
  //const model = "llama-3.3-70b-versatile";
  //const model = "qwen-2.5-32b";
  //const model = "llama-3.2-3b-preview";
  const model = "mistral-saba-24b";
  const chat_message = new ChatMessage('user', message);
  console.log(JSON.stringify(chat_message));
  const content = new ChatCompletion([chat_message], model);
  console.log(JSON.stringify(content));
  const bodyString = JSON.stringify(content);
  const request = new http.Request(url, {
    method: "POST",
    headers: http.Headers.from([
      ["Content-Type", "application/json"],
    ]),
    body: http.Content.from(bodyString),
  } as http.RequestOptions);
  const response = http.fetch(request)
  const data = response.json<OpenAIChatOutput>(); console.log(data);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch. Received: ${response.status} ${response.statusText}`,
    );
  }
  //message_post("1250048055563124800", data.choices[0].message.content.trim())
  return data.choices[0].message.content.trim()
}