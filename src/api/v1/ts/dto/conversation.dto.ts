import { Member, Message } from '../interfaces/common';

export interface MembersDTO {
  members: Member[];
}

export interface ClientSendRoomMessDTO {
  conversationID?: string;
  members: Member[];
  message: Message;
}
