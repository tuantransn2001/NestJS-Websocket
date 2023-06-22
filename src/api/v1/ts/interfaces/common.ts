export interface Member {
  id: string;
  type: string;
}

export interface Message {
  sender: Member;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Conversation {
  id: string;
  name: string;
  members: Member[];
  messages: Message[];
  createdAt?: Date;
  updatedAt?: Date;
}
