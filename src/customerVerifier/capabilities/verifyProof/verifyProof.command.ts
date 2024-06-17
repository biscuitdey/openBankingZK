import { PublicWitness } from '../../models/publicWitness';

export class VerifyProofCommand {
  constructor(
    public readonly publicWitness: PublicWitness,
    public readonly publicKey: string,
  ) {}
}
