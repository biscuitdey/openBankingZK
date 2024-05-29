import { Payload } from '../../models/payload';

export class CreateProofCommand {
  constructor(
    public readonly payload: Payload,
    public readonly signature: string,
    public readonly publicKey: string,
  ) {}
}
