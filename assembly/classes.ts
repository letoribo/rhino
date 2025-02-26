export class Node {
    id: string;
    name: string;
    content: string;

    constructor(id: string, name: string, content: string) {
        this.id = id;
        this.name = name;
        this.content = content;
    }
}

export class Triplet {
    n: Node;
    r: string;
    m: Node;

    constructor(n: Node, r: string, m: Node) {
        this.n = n;
        this.r = r;
        this.m = m;
    }
}

export class RAGResponse {
    answer: string;
    retriever_result: Triplet[] = [];

    constructor(answer: string, retriever_result: Triplet[]) {
        this.answer = answer;
        this.retriever_result = retriever_result;
    }
}

@json
export class Author {
    global_name: string;
    username: string;
  
    constructor(global_name: string, username: string) {
        this.global_name = global_name;
        this.username = username;
    }
}

@json
export class MessageReference {
    channel_id: string;
    message_id: string;

    constructor(channel_id: string, message_id: string) {
        this.channel_id = channel_id;
        this.message_id = message_id;
    }
}

@json
export class Attachment {
    url: string;

    constructor(url: string) {
        this.url = url;
    }
}

@json
export class Thread {
    id: string;
    name: string;
    message_count: i8;

    constructor(id: string, name: string, message_count: i8) {
        this.id = id;
        this.name = name;
        this.message_count = message_count;
    }
}

@json
export class Message {
    content: string;
    author: Author;
    type: i8;
    timestamp: string;
    id: string;
    channel_id: string;
    attachments: Attachment[] = [];
    message_reference: MessageReference | null;
    thread: Thread | null;

    constructor(content: string, author: Author, type: i8, timestamp: string, id: string, channel_id: string, attachments: Attachment[], message_reference: MessageReference | null, thread: Thread | null) {
        this.content = content;
        this.author = author;
        this.type = type;
        this.timestamp = timestamp;
        this.channel_id = channel_id;
        this.id = id;
        this.attachments = attachments;
        this.message_reference = message_reference/*  || null */;
        this.thread = thread;
    }
}

@json
export class Guild {
    id: string;
    icon: string;
    name: string;
  
    constructor(id: string, icon: string, name: string) {
        this.id = id;
        this.icon = icon;
        this.name = name;
    }
}


@json
export class Channel {
    id: string;
    parent_id: string;
    name: string;
    topic: string;
    guild_id: string;
  
    constructor(id: string, parent_id: string, name: string, topic: string, guild_id: string) {
        this.id = id;
        this.parent_id = parent_id;
        this.name = name;
        this.topic = topic;
        this.guild_id = guild_id;
    }
}

@json
export class MessageContent {
    content: string;

    constructor(content: string) {
        this.content = content;
    }
}

@json
export class ChatMessage {
    role: string;
    content: string;

    constructor(role: string, content: string) {
        this.role = role;
        this.content = content;
    }
}

@json
export class ChatCompletion {
    messages: ChatMessage[] = [];
    model: string;

    constructor(messages: ChatMessage[], model: string) {
        this.messages = messages;
        this.model = model;
    }
}
