import { neo4j, models, http, DynamicMap } from "@hypermode/modus-sdk-as";
import { Message, Author, MessageReference, Guild, Channel } from "./classes";
import * as console from "as-console";
import {
  OpenAIChatModel,
  SystemMessage,
  UserMessage,
  Message as AIMessage
} from "@hypermode/modus-sdk-as/models/openai/chat";
import { JSON } from "json-as";

export function Discord(channel_id: string): Message[] {
  const url = `https://discord.com/api/v10/channels/${channel_id}/messages?limit=2`

  const response = http.fetch(url)
  //console.log(JSON.stringify(response.json<Message[]>()));
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

    addNode(prompt, author, type, timestamp, id, channel_id, message_reference);
  }

  return 'OK'
}

export function addNode(content: string, author: Author, type: i8, timestamp: string, id: string, channel_id: string, message_reference: MessageReference  ): Message {
  const global_name = author.global_name;
  const username = author.username;
  const message_id = message_reference.message_id;
  const query = "MERGE (n:Message {content: $content, global_name: $global_name, username: $username, type: $type, timestamp: $timestamp, id: $id, channel_id: $channel_id, ref_id: $ref_id}) RETURN n;"
  const vars = new neo4j.Variables();
  vars.set("content", content);
  vars.set("global_name", global_name);
  vars.set("username", username);
  vars.set("type", type);
  vars.set("timestamp", timestamp);
  vars.set("id", id);
  vars.set("channel_id", channel_id);
  vars.set("ref_id", message_id);
  const result = neo4j.executeQuery('neo4j', query, vars);
  const record = result.Records[0];
  const node = record.getValue<neo4j.Node>('n');

  const author2 = new Author(node.Props.get<string>("username"), global_name)
  const message_reference2 = new MessageReference(node.Props.get<string>("ref_id"));
  const message = new Message(node.Props.get<string>("content"), author2, node.Props.get<i8>("type"), node.Props.get<string>("timestamp"), node.Props.get<string>("id"), node.Props.get<string>("channel_id"), message_reference2);

  return message;
}

export function DiscordRaw(channel_id: string): JSON.Raw {
  const url = `https://discord.com/api/v10/channels/${channel_id}/messages?limit=10`
  //const url = `https://discord.com/api/v10/channels/${channel_id}/messages?around=${message_id}&limit=1`
  //const url = `https://discord.com/api/v10/guilds/${guild_id}/channels`
  const response = http.fetch(url)
  const data = response.json<JSON.Raw>(); console.log(data);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch messages. Received: ${response.status} ${response.statusText}`,
    );
  }
  return data
}

export function DiscordGuilds(): Guild[] {
  const url = `https://discord.com/api/v10/users/@me/guilds`

  const response = http.fetch(url)
  //const data = response.json<JSON.Raw>(); console.log(data);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data. Received: ${response.status} ${response.statusText}`,
    );
  }

  return response.json<Guild[]>()
}

export function guilds2Neo(): string {
  const response = DiscordGuilds();

  for (let i = 0; i < response.length; i++) { console.log(response[i].name);
    const id = response[i].id;
    const icon = response[i].icon;
    const name = response[i].name;

    addGuildNode(id, icon, name);
  }

  return 'OK'
}

export function addGuildNode(id: string, icon: string, name: string  ): Guild {
  const query = "MERGE (n:Guild {id: $id, icon: $icon, name: $name}) RETURN n;"
  const vars = new neo4j.Variables();
  vars.set("id", id);
  vars.set("icon", icon);
  vars.set("name", name);
  const result = neo4j.executeQuery('neo4j', query, vars);
  const record = result.Records[0];
  const node = record.getValue<neo4j.Node>('n');

  const guild = new Guild(node.Props.get<string>("id"), node.Props.get<string>("icon"), node.Props.get<string>("name"));

  return guild;
}

export function guildChannels(guild_id: string): Channel[] {
  const url = `https://discord.com/api/v10/guilds/${guild_id}/channels`
  const response = http.fetch(url)
  const data = response.json<JSON.Raw>(); console.log(data);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch messages. Received: ${response.status} ${response.statusText}`,
    );
  }
  return response.json<Channel[]>()
}