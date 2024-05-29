import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { INVALID_SIGNATURE } from '../api/err.messages';
import { LoggingService } from '../../shared/logging/logging.service';
import { buildBabyjub, buildEddsa } from 'circomlibjs';
import * as crypto from 'crypto';
import { Payload } from '../models/payload';
import { Witness } from '../models/witness';
import { ICircuitService } from '../service/circuit/circuitService.interface';
import 'dotenv/config';

@Injectable()
export class ProofAgent {
  constructor(
    @Inject('ICircuitService') private readonly circuitService: ICircuitService,
    private readonly logger: LoggingService,
  ) {}
  throwIfSignatureVerificationFails(
    message: string,
    signature: string,
    publicKey: string,
  ): void {
    if (
      !this.verifyEddsaSignatureAgainstPublicKey(message, signature, publicKey)
    ) {
      throw new UnauthorizedException(INVALID_SIGNATURE);
    }
  }

  async verifyEddsaSignatureAgainstPublicKey(
    message: string,
    signature: string,
    senderPublicKey: string,
  ): Promise<boolean> {
    const eddsa = await buildEddsa();
    const babyJub = await buildBabyjub();

    const hashedPayload = crypto
      .createHash(`${process.env.MERKLE_TREE_HASH_ALGH}`)
      .update(JSON.stringify(message))
      .digest();

    const publicKey = Uint8Array.from(Buffer.from(senderPublicKey, 'hex'));
    const publicKeyPoints = babyJub.unpackPoint(publicKey);

    const eddsaSignature = Uint8Array.from(Buffer.from(signature, 'hex'));

    const unpackedSignature = eddsa.unpackSignature(eddsaSignature);

    const isValid = eddsa.verifyPedersen(
      hashedPayload,
      unpackedSignature,
      publicKeyPoints,
    );

    if (!isValid) {
      this.logger.logWarn(
        `Signature: ${signature} for public key ${senderPublicKey} is invalid.`,
      );
    }

    return isValid;
  }

  async createProofWitness(
    payload: Payload,
    signature: string,
    publicKey: string,
  ): Promise<Witness> {
    const {
      snakeCaseWorkstepName,
      circuitProvingKeyPath,
      circuitVerificatioKeyPath,
      circuitPath,
      circuitWitnessCalculatorPath,
      circuitWitnessFilePath,
    } = this.constructCircuitPathsFromWorkstepName(
      process.env.CUSTOMER_BANK_PROOF_CIRCUIT_NAME,
    );

    const witness: Witness = await this.circuitService.createWitness(
      { payload, signature, publicKey },
      snakeCaseWorkstepName,
      circuitPath,
      circuitProvingKeyPath,
      circuitVerificatioKeyPath,
      circuitWitnessCalculatorPath,
      circuitWitnessFilePath,
    );

    return witness;
  }

  private constructCircuitPathsFromWorkstepName(name: string): {
    snakeCaseWorkstepName: string;
    circuitProvingKeyPath: string;
    circuitVerificatioKeyPath: string;
    circuitPath: string;
    circuitWitnessCalculatorPath: string;
    circuitWitnessFilePath: string;
  } {
    const snakeCaseWorkstepName = this.convertStringToSnakeCase(name);

    const circuitProvingKeyPath =
      process.env.SNARKJS_CIRCUITS_PATH +
      snakeCaseWorkstepName +
      '/' +
      snakeCaseWorkstepName +
      '_final.zkey';

    const circuitVerificatioKeyPath =
      process.env.SNARKJS_CIRCUITS_PATH +
      snakeCaseWorkstepName +
      '/' +
      snakeCaseWorkstepName +
      '_verification_key.json';

    const circuitPath =
      process.env.SNARKJS_CIRCUITS_PATH +
      snakeCaseWorkstepName +
      '/' +
      snakeCaseWorkstepName +
      '_js/' +
      snakeCaseWorkstepName +
      '.wasm';

    const circuitWitnessCalculatorPath =
      '../../../../../.' +
      process.env.SNARKJS_CIRCUITS_PATH +
      snakeCaseWorkstepName +
      '/' +
      snakeCaseWorkstepName +
      '_js/witness_calculator';

    const circuitWitnessFilePath =
      process.env.SNARKJS_CIRCUITS_PATH +
      snakeCaseWorkstepName +
      '/witness.txt';
    return {
      snakeCaseWorkstepName,
      circuitProvingKeyPath,
      circuitVerificatioKeyPath,
      circuitPath,
      circuitWitnessCalculatorPath,
      circuitWitnessFilePath,
    };
  }

  // TODO: #744 ChatGPT generated only for the purposes of temporary convention
  // to connect worksteps with circuits on the file system.
  private convertStringToSnakeCase(name: string): string {
    // Remove any leading or trailing spaces
    name = name.trim();

    // Replace spaces, hyphens, and underscores with a single underscore
    name = name.replace(/[\s-]/g, '_');

    // Convert uppercase letters to lowercase and insert an underscore before them if they are not at the beginning
    name = name.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);

    // Remove any consecutive underscores
    name = name.replace(/_+/g, '_');

    // Remove any non-alphanumeric characters except for underscore
    name = name.replace(/[^a-zA-Z0-9_]/g, '');

    return name;
  }
}
