import { Test } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { INestApplication } from '@nestjs/common';
import { ChatService } from './chat.service';
import { modelDefineProvider } from '../common/provider';
import { Conversation } from './entities/conversation.entity';
import { UnibertyService } from '../uniberty/uniberty.service';
import { DatabaseModule } from '../database/database.module';
import { MODEL_NAME } from '../common/enums/common';
async function createNestApp(): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    imports: [DatabaseModule],
    providers: [
      ...modelDefineProvider(MODEL_NAME.CONVERSATION, Conversation),
      ChatGateway,
      ChatService,
      UnibertyService,
    ],
  }).compile();
  return testingModule.createNestApplication();
}
describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let app: INestApplication;

  beforeAll(async () => {
    // Instantiate the app
    app = await createNestApp();
    // Get the gateway instance from the app instance
    gateway = app.get<ChatGateway>(ChatGateway);

    app.listen(3000);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
