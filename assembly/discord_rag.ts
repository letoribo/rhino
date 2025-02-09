import { models } from "@hypermode/modus-sdk-as";
import {
    OpenAIChatModel,
    SystemMessage,
    UserMessage,
    RequestMessage
  } from "@hypermode/modus-sdk-as/models/openai/chat";
import { JSON } from "json-as";
import { Discord } from "./discord";

//const modelName: string = "text-generator"
const modelName: string = "deepseek-reasoner"

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

  const output = model.invoke(input)
  console.log(JSON.stringify(output.choices));
  return output.choices[0].message.content.trim()
}