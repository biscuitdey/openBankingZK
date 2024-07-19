import { PublicWitness } from '../../models/publicWitness';

export class VerifyCertificateCommand {
  constructor(
    public readonly publicWitness: PublicWitness,
    public readonly publicKey: string,
  ) {}
}
