import { http, DynamicMap } from "@hypermode/modus-sdk-as";
import * as console from "as-console";
import { JSON } from "json-as";

export function DiscordRaw(channel_id: string): JSON.Raw {
  const url = `https://discord.com/api/v10/channels/${channel_id}/messages`
  /* const thread_id = '1328810304540377208'
  const url = `https://discord.com/api/v10/channels/${thread_id}/messages` */
  /* const message_id = '1319781724456095774'
  const url = `https://discord.com/api/v10/channels/${channel_id}/messages?around=${message_id}&limit=1` */
  //const url = `https://discord.com/api/v10/guilds/1250870606396915822/channels`
  const response = http.fetch(url)
  const data = response.json<JSON.Raw>(); console.log(data);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch messages. Received: ${response.status} ${response.statusText}`,
    );
  }
  return data
}