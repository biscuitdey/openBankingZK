import { Payload } from '../../models/payload';

export class CreateCertificateCommand {
  constructor(
    public readonly payload: Payload,
    public readonly signature: string,
    public readonly publicKey: string,
  ) {}
}
