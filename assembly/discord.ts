import { http } from "@hypermode/modus-sdk-as";
import { Message, MessageContent } from "./classes";
import * as console from "as-console";
import { JSON } from "json-as";

export function Discord(channel_id: string): Message[] {
    const url = `https://discord.com/api/v10/channels/${channel_id}/messages` //?limit=50
    const response = http.fetch(url)
    //console.log(JSON.stringify(response.json<Message[]>()));
    if (!response.ok) {
      throw new Error(
        `Failed to fetch messages. Received: ${response.status} ${response.statusText}`,
      );
    }
  
    return response.json<Message[]>()
}

export function message_post(channel_id: string, message: string): Message {
    const url = `https://discord.com/api/v10/channels/${channel_id}/messages`
    const request = new http.Request(url, {
      method: "POST",
      headers: http.Headers.from([
        ["Content-Type", "application/json"],
      ]),
      body: http.Content.from(new MessageContent(message)),
    } as http.RequestOptions);
    const response = http.fetch(request)
    console.log(JSON.stringify(response.json<Message>()));
    if (!response.ok) {
      throw new Error(
        `Failed to send the message. Received: ${response.status} ${response.statusText}`,
      );
    }
    return response.json<Message>()
}
