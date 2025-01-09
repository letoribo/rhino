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
    //channel_id: string;
    message_id: string;

    constructor(/* channel_id: string, */ message_id: string) {
        //this.channel_id = channel_id;
        this.message_id = message_id;
    }
}

@json
export class Message {
    content: string;
    author: Author;
    type: i8;
    timestamp: string;
    id: string;
    message_reference: MessageReference

    constructor(content: string, author: Author, type: i8, timestamp: string, id: string, message_reference: MessageReference) {
        this.content = content;
        this.author = author;
        this.type = type;
        this.timestamp = timestamp;
        this.id = id;
        this.message_reference = message_reference;
    }
}