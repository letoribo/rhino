import { models } from "@hypermode/modus-sdk-as";
import {
    OpenAIChatModel,
    SystemMessage,
    UserMessage,
    RequestMessage
  } from "@hypermode/modus-sdk-as/models/openai/chat";
import { JSON } from "json-as";
import { getMatches } from "./records";
import { RAGResponse } from "./classes";

const modelName: string = "text-generator"
//const modelName: string = "deepseek-reasoner"

export function GraphRAG(instruction: string, q: string, channel_id: string): RAGResponse {
  const response = getMatches(q, channel_id);

  let messages: RequestMessage[] = [new SystemMessage(instruction),]

  for (let i = 0; i < response.length; i++) {
    const result = response[i];
    console.log(`Message: ${result.n.content}`);
    console.log(`Rel: ${result.r}`);
    console.log(`Channel: ${result.m.name}`);
    messages.push(new UserMessage(result.n.content)); 
  }

  const model = models.getModel<OpenAIChatModel>(modelName)
  const input = model.createInput(messages)

  // this is one of many optional parameters available for the OpenAI chat interface
  input.temperature = 0.7

  const output = model.invoke(input)
  console.log(JSON.stringify(output.choices));

  const rag_response = new RAGResponse(output.choices[0].message.content.trim(), response);
  return rag_response
}