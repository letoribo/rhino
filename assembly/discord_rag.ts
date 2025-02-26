import { models } from "@hypermode/modus-sdk-as";
import {
    OpenAIChatModel,
    SystemMessage,
    UserMessage,
    RequestMessage,
    OpenAIChatOutput
  } from "@hypermode/modus-sdk-as/models/openai/chat";
import { JSON } from "json-as";
import { Discord, message_post } from "./discord";
import { Groq } from "./groq";
import { ChatMessage, ChatCompletion } from "./classes";
import { http } from "@hypermode/modus-sdk-as";
import * as console from "as-console";

const modelName: string = "text-generator"
//const modelName: string = "distilbart"
//const modelName: string = "deepseek-reasoner"

export function DRAG(instruction: string, channel_id: string): string {
  const response = Discord(channel_id);
  const prompts = response.map<string>((c) => c.content.trim());
  
  let messages: RequestMessage[] = [new SystemMessage(instruction),]

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
  input.maxCompletionTokens = 350
  //input.maxTokens = 400

  const output = model.invoke(input)
  console.log(JSON.stringify(output.choices));
  //message_post(channel_id, output.choices[0].message.content.trim())
  return output.choices[0].message.content.trim()
}

export function DGRAG(instruction: string, channel_id: string): string {
  const result = Discord(channel_id);
  const prompts = result.map<string>((c) => c.content.trim());

  const system_message = new ChatMessage('system', instruction);
  
  let messages: ChatMessage[] = [system_message,]

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    if (prompt.length) { console.log(prompt);
      const user_message = new ChatMessage('user', prompt);
      messages.push(user_message); 
    }
  }
  const url = `https://api.groq.com/openai/v1/chat/completions`
  //const model = "llama-3.3-70b-versatile";
  //const model = "qwen-2.5-32b";
  //const model = "llama-3.2-3b-preview";
  const model = "mistral-saba-24b";

  const content = new ChatCompletion(messages, model);
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
  message_post(channel_id, data.choices[0].message.content.trim())
  return data.choices[0].message.content.trim()
}

export function GroqRAG(channel_id: string, message: string): string {
  const response = Groq(message);
  //message_post("1250048055563124800", response);
  message_post(channel_id, response);
  return response
}