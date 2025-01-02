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
export class Message {
    content: string;
    author: Author;
    type: i8;
    timestamp: Date;
    id: string;

    constructor(content: string, author: Author, type: i8, timestamp: Date, id: string) {
        this.content = content;
        this.author = author;
        this.type = type;
        this.timestamp = timestamp;
        this.id = id;
    }
}
