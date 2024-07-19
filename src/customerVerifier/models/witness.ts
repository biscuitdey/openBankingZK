import { Certificate } from './certificate';

export class Witness {
  certificate: Certificate;

  publicInputs?: string[];

  verificationKey: object;
}
