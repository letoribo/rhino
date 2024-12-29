import { models, http } from "@hypermode/modus-sdk-as";
import { Message } from "./classes";
import * as console from "as-console";
import {
  OpenAIChatModel,
  SystemMessage,
  UserMessage,
  Message as AIMessage
} from "@hypermode/modus-sdk-as/models/openai/chat";
import { JSON } from "json-as";

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

const modelName: string = "text-generator"

export function DRAG(instruction: string, q: string, channel_id: string, message_id: string): string/* [] */ {
  const response = Discord(q, channel_id, message_id);
  const prompts = response.map<string>((c) => c.content.trim());
  
  let messages: AIMessage[] = [new SystemMessage(instruction),]

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    if (prompt.length) { console.log(prompt);
      messages.push(new UserMessage(prompt)); 
    }
  }

  const model = models.getModel<OpenAIChatModel>(modelName)
  const input = model.createInput(messages)

  // this is one of many optional parameters available for the OpenAI chat interface
  input.temperature = 0.7

  const output = model.invoke(input)
  console.log(JSON.stringify(output.choices));
  return output.choices[0].message.content.trim()
}

