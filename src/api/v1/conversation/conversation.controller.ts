import { Body, Controller, Get, Query } from '@nestjs/common';
import { ConversationServices } from './conversation.service';
import { MembersDTO } from '../ts/dto/conversation.dto';
import { Member } from '../ts/interfaces/common';

@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationServices) {}

  @Get('/get-by-members')
  public async getConversationByMember(@Body() membersData: MembersDTO) {
    return await this.conversationService.getByMembers(membersData);
  }

  @Get('/get-contact')
  public async getContactList(@Query() { id, type }: Member) {
    return await this.conversationService.getContactList({ id, type });
  }
}
