@json
class Author {
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

    constructor(content: string, author: Author) {
        this.content = content;
        this.author = author;
    }
}

