import { Member, Message } from '../interfaces/common';

interface MembersDTO {
  members: Member[];
}

interface ClientSendRoomMessDTO {
  conversationID?: string;
  members: Member[];
  message: Message;
}

export { MembersDTO, ClientSendRoomMessDTO };
