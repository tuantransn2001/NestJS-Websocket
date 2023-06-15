interface Member {
  id: string;
  type: string;
}

interface Message {
  sender: Member;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface Conversation {
  id: string;
  name: string;
  members: Member[];
  messages: Message[];
  createdAt?: Date;
  updatedAt?: Date;
}

export { Conversation, Message, Member };
