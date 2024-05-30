import { AutoMap } from '@automapper/classes';
import { Proof } from './proof';

export class CustomerVerifier {
  @AutoMap()
  id: string;

  @AutoMap()
  publicKey: string;

  @AutoMap()
  proof: Proof;

  constructor(id: string, publicKey: string, proof: Proof) {
    this.id = id;
    this.publicKey = publicKey;
    this.proof = proof;
  }

  public updatePublicKey(newPublicKey: string): void {
    this.publicKey = newPublicKey;
  }

  public updateProof(newProof: Proof): void {
    this.proof = newProof;
  }

  public updateId(newId: string): void {
    this.id = newId;
  }
}
