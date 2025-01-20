import { neo4j } from "@hypermode/modus-sdk-as";
import { Node, Triplet } from "./classes";
import * as console from "as-console";

export function getMatches(q: string, channel_id: string): Triplet[] {

    const query = `
      MATCH (n:Channel {id: $channel_id })-[r]-(m) WHERE m.content CONTAINS $q RETURN n, r, m;
    `
    const vars = new neo4j.Variables();
    vars.set("q", q);
    vars.set("channel_id", channel_id);
  
    const result = neo4j.executeQuery('neo4j', query, vars);
    let triplets: Triplet[] = []
  
    for (let i = 0; i < result.Records.length; i++) {
      const record = result.Records[i];
      const start = record.getValue<neo4j.Node>('n');
      const r = record.getValue<neo4j.Relationship>('r');
      const end = record.getValue<neo4j.Node>('m'); //console.log(end.getProperty<string>("content"));

      const n = new Node(
        end.getProperty<string>("id"),
        '',
        end.getProperty<string>("content"),
      );
      const m = new Node(
        start.getProperty<string>("id"),
        start.getProperty<string>("name"),
        ''
      );
      //const triplet = new Triplet(n, r, m);
      triplets.push(new Triplet(n, r.Type, m))
    }
  
    return triplets;
  }