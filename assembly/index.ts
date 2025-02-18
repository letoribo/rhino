import { neo4j, http } from "@hypermode/modus-sdk-as";
import { Message, Author, Attachment, MessageReference, Thread, Guild, Channel } from "./classes";
import * as console from "as-console";

import { JSON } from "json-as";
import { DiscordRaw } from "./discord_raw";
import { Discord, message_post } from "./discord";
import { DRAG } from "./discord_rag";
import { GraphRAG } from "./graph_rag";
import { getMatches } from "./records";
export { Discord, message_post, DiscordRaw, DRAG, getMatches, GraphRAG }

export function Discord2Neo(channel_id: string): Message[] {
  const response = Discord(channel_id);
  let messages: Message[] = []

  for (let i = 0; i < response.length; i++) {
    const content = response[i].content;
    const author = response[i].author;
    const type = response[i].type;
    const timestamp = response[i].timestamp;
    const id = response[i].id;
    const attachments = mapAttachments(response[i].attachments);
    const message_reference = response[i].message_reference;
    const thread = response[i].thread;

    const message = addMessage(content, author, type, timestamp, id, channel_id, attachments, message_reference, thread); //console.log(JSON.stringify(message));
    messages.push(message)
  }
  return messages
}

const mapAttachments = (arr: Attachment[]): string[] => {
  let attachments: string[] = []

  for (let i = 0; i < arr.length; i++) {
    const url = arr[i].url;
    attachments.push(url)
  }
  return attachments
}

export function addMessage(content: string, author: Author, type: i8, timestamp: string, id: string, channel_id: string, attachments: string[], message_reference: MessageReference | null = null, thread: Thread | null = null): Message {
  const global_name = author.global_name;
  const username = author.username;
  
  const vars = new neo4j.Variables();
  vars.set("content", content);
  vars.set("global_name", global_name);
  vars.set("username", username);
  vars.set("type", type);
  vars.set("timestamp", timestamp);
  vars.set("id", id);
  vars.set("channel_id", channel_id);
  vars.set("attachments", attachments);
  if (message_reference) { //console.log(`message_reference: ${JSON.stringify(message_reference)}`);
    vars.set("message_reference", JSON.stringify(message_reference));
  } else vars.set("message_reference", message_reference);
  if (thread) {
    vars.set("thread", JSON.stringify(thread));
  } else vars.set("thread", thread);
  
  const query = `
  MERGE (n:Message {
    content: $content,
    global_name: $global_name,
    username: $username,
    type: $type,
    timestamp: $timestamp,
    id: $id,
    channel_id: $channel_id,
    attachments: $attachments
  })
  WITH n
  MATCH (m:Channel {id: $channel_id})
  MERGE (n)-[:IN]->(m)

  WITH n, $message_reference AS message_reference, $thread AS thread

  FOREACH (_ IN CASE WHEN message_reference IS NOT NULL THEN [1] ELSE [] END |
    SET n.message_reference = message_reference
  )

  FOREACH (_ IN CASE WHEN thread IS NOT NULL THEN [1] ELSE [] END |
    SET n.thread = thread
  )`
  
  const result = neo4j.executeQuery('neo4j', query, vars);

  let attachments2: Attachment[] = []
  
  for (let i = 0; i < attachments.length; i++) {
    const url = attachments[i];
    attachments2.push(new Attachment(url))
  }

  const message = new Message(content, author, type, timestamp, id, channel_id, attachments2, message_reference || null, thread || null);
  return message;
}

export function DiscordGuilds(): Guild[] {
  const url = `https://discord.com/api/v10/users/@me/guilds` //?limit=1&after=267624335836053506

  const response = http.fetch(url)
  //console.log(JSON.stringify(response.json<Guild[]>()));
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data. Received: ${response.status} ${response.statusText}`,
    );
  }

  return response.json<Guild[]>()
}

export function guilds2Neo(): Guild[] {
  const response = DiscordGuilds();
  let guilds: Guild[] = []

  for (let i = 0; i < response.length; i++) {
    const id = response[i].id;
    const icon = response[i].icon;
    const name = response[i].name;

    const guild = addGuild(id, icon, name);
    guilds.push(guild)
  }

  return guilds
}

export function addGuild(id: string, icon: string, name: string  ): Guild {
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
  //console.log(JSON.stringify(response.json<Channel[]>()));
  if (!response.ok) {
    throw new Error(
      `Failed to fetch messages. Received: ${response.status} ${response.statusText}`,
    );
  }
  return response.json<Channel[]>()
}

export function channels2Neo(guild_id: string): Channel[] {
  const response = guildChannels(guild_id);
  let channels: Channel[] = []

  for (let i = 0; i < response.length; i++) {
    const id = response[i].id;
    const parent_id = response[i].parent_id === 'ul' ? '' : response[i].parent_id;
    const name = response[i].name;
    const topic = response[i].topic === 'ul' ? '' : response[i].topic; //console.log(topic);
    const guild_id = response[i].guild_id;

    const channel = addChannel(id, parent_id, name, topic, guild_id);
    channels.push(channel)
  }

  return channels
}

export function addChannel(id: string, parent_id: string, name: string, topic: string, guild_id: string): Channel {
  const query = `
  MERGE (n:Channel {id: $id, parent_id: $parent_id, name: $name, topic: $topic, guild_id: $guild_id})
  WITH n
  MATCH (m:Guild {id: $guild_id})
  MERGE (n)-[:IN]->(m)`
  const vars = new neo4j.Variables();
  vars.set("id", id);
  vars.set("parent_id", parent_id);
  vars.set("name", name);
  vars.set("topic", topic);
  vars.set("guild_id", guild_id);
  neo4j.executeQuery('neo4j', query, vars);
  
  const channel = new Channel(id, parent_id, name, topic, guild_id);
  return channel;
}
