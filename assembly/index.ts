import { neo4j, models, http, DynamicMap } from "@hypermode/modus-sdk-as";
import { Message, Author, MessageReference } from "./classes";
import * as console from "as-console";
import {
  OpenAIChatModel,
  SystemMessage,
  UserMessage,
  Message as AIMessage
} from "@hypermode/modus-sdk-as/models/openai/chat";
import { JSON } from "json-as";

export function Discord(channel_id: string): Message[] {
  const url = `https://discord.com/api/v10/channels/${channel_id}/messages`

  const response = http.fetch(url)
  console.log(JSON.stringify(response.json<Message[]>()));
  if (!response.ok) {
    throw new Error(
      `Failed to fetch messages. Received: ${response.status} ${response.statusText}`,
    );
  }

  return response.json<Message[]>()
}

const modelName: string = "text-generator"

export function DRAG(instruction: string, channel_id: string): string {
  const response = Discord(channel_id);
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

export function Discord2Neo(channel_id: string): string {
  const response = Discord(channel_id);

  for (let i = 0; i < response.length; i++) {
    const prompt = response[i].content;
    const author = response[i].author;
    const type = response[i].type;
    const timestamp = response[i].timestamp;
    const id = response[i].id;
    const message_reference = response[i].message_reference;

    addNode(prompt, author, type, timestamp, id, message_reference);
  }

  return 'OK'
}

export function addNode(content: string, author: Author, type: i8, timestamp: Date, id: string, message_reference: MessageReference  ): Message {
  const global_name = author.global_name;
  const username = author.username;
  const message_id = message_reference.message_id;
  const query = "MERGE (n:Message {content: $content, global_name: $global_name, username: $username, type: $type, timestamp: $timestamp, id: $id, ref_id: $ref_id}) RETURN n;"
  const vars = new neo4j.Variables();
  vars.set("content", content);
  vars.set("global_name", global_name);
  vars.set("username", username);
  vars.set("type", type);
  vars.set("timestamp", timestamp);
  vars.set("id", id);
  vars.set("ref_id", message_id);
  const result = neo4j.executeQuery('neo4j', query, vars);
  const record = result.Records[0];
  const node = record.getValue<neo4j.Node>('n');

  console.log(`Id: ${node.Props.get<string>("id")}`);
  console.log(`Content: ${node.Props.get<string>("content")}`);
  console.log(`Keys: ${node.Props.keys()}`);
  console.log(`Global_name: ${node.Props.get<string>("global_name")}`);
  const author2 = new Author(node.Props.get<string>("username"), global_name)
  const message_reference2 = new MessageReference(node.Props.get<string>("ref_id"));
  const message = new Message(node.Props.get<string>("content"), author2, node.Props.get<i8>("type"), node.Props.get<Date>("timestamp"), node.Props.get<string>("id"), message_reference2);

  return message;
}

export function getContent(): DynamicMap {
  //const url = "https://discord.com/api/v10/channels/1292948253796466730/messages?around=1324297283382153218&limit=1"; //not working
  const url = "https://discord.com/api/v10/channels/1292948253796466730/messages?around=1326277761093992520&limit=1"; //not working
    
  const response = http.fetch(url);
  const data = response.json<JSON.Raw>(); console.log(data);

  const m = JSON.parse<DynamicMap>(data);
  return m
}
