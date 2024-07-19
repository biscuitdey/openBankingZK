import { AutoMap } from '@automapper/classes';
import { Certificate } from './certificate';

export class CustomerVerifier {
  @AutoMap()
  id: string;

  @AutoMap()
  publicKey: string;

  @AutoMap()
  certificate: Certificate;

  constructor(id: string, publicKey: string, certificate: Certificate) {
    this.id = id;
    this.publicKey = publicKey;
    this.certificate = certificate;
  }

  public updatePublicKey(newPublicKey: string): void {
    this.publicKey = newPublicKey;
  }

  public updateCertificate(newCertificate: Certificate): void {
    this.certificate = newCertificate;
  }

  public updateId(newId: string): void {
    this.id = newId;
  }
}
