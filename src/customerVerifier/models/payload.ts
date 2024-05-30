import { AutoMap } from '@automapper/classes';

export class Payload {
  @AutoMap()
  name: string;

  @AutoMap()
  bankName: string;

  @AutoMap()
  accountNumber: string;

  @AutoMap()
  ifsc: string;
}
