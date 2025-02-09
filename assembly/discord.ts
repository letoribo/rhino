import { http } from "@hypermode/modus-sdk-as";
import { Message } from "./classes";
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
