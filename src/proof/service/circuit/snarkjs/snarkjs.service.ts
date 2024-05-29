import { Injectable, BadRequestException } from '@nestjs/common';
import { Witness } from '../../../models/witness';
import { Proof } from '../../../models/proof';
import { ICircuitService } from '../circuitService.interface';
import { computeEddsaSigPublicInputs } from './utils/computePublicInputs';
import * as snarkjs from 'snarkjs';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { Payload } from 'src/proof/models/payload';

@Injectable()
export class SnarkjsCircuitService implements ICircuitService {
  public witness: Witness;

  public async throwIfCreateWitnessInputInvalid(
    publicInputs: string[],
  ): Promise<void> {
    if (publicInputs[0] === '0') {
      throw new BadRequestException('Invalid circuit inputs');
    }
  }

  public async createWitness(
    inputs: {
      payload: Payload;
      signature: string;
      publicKey: string;
    },
    circuitName: string,
    pathToCircuit: string,
    pathToProvingKey: string,
    pathToVerificationKey: string,
    pathToWitnessCalculator: string,
    pathToWitnessFile: string,
  ): Promise<Witness> {
    this.witness = new Witness();

    const preparedInputs = await this.prepareInputs(inputs, circuitName);

    const { proof, publicInputs } = await this.executeCircuit(
      preparedInputs,
      pathToCircuit,
      pathToProvingKey,
      pathToWitnessCalculator,
      pathToWitnessFile,
    );

    this.witness.proof = proof;

    this.witness.publicInputs = publicInputs;

    try {
      const data = fs.readFileSync(pathToVerificationKey, 'utf8');
      this.witness.verificationKey = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('Circuit verification key file does not exist.');
      } else {
        throw new Error('Error while reading circuit verification key file');
      }
    }

    return this.witness;
  }

  public async verifyProofUsingWitness(witness: Witness): Promise<boolean> {
    const isVerified = await snarkjs.plonk.verify(
      witness.verificationKey,
      witness.publicInputs,
      witness.proof.value,
    );
    return isVerified;
  }

  private async executeCircuit(
    inputs: object,
    pathToCircuit: string,
    pathToProvingKey: string,
    pathToWitnessCalculator: string,
    pathToWitnessFile: string,
  ): Promise<{ proof: Proof; publicInputs: string[] }> {
    const buffer = fs.readFileSync(pathToCircuit);
    const wc = await import(pathToWitnessCalculator);
    const witnessCalculator = await wc(buffer);

    const buff = await witnessCalculator.calculateWTNSBin(inputs, 0);
    fs.writeFileSync(pathToWitnessFile, buff);

    const { proof, publicSignals: publicInputs } = await snarkjs.plonk.prove(
      pathToProvingKey,
      pathToWitnessFile,
    );

    await this.throwIfCreateWitnessInputInvalid(publicInputs);

    const newProof = {
      value: proof,
      protocol: proof.protocol,
      curve: proof.curve,
    } as Proof;

    return { proof: newProof, publicInputs };
  }

  private async prepareInputs(
    inputs: {
      payload: Payload;
      signature: string;
      publicKey: string;
    },
    circuitName: string,
  ): Promise<object> {
    return await this[circuitName](inputs);
  }

  private async bankProof(inputs: {
    payload: Payload;
    signature: string;
    publicKey: string;
  }): Promise<object> {
    //1. Eddsa signature
    const { message, A, R8, S } = await computeEddsaSigPublicInputs(inputs);

    //2. Name
    const privateName = this.hash(inputs.payload.name);

    const privateBankName = this.hash(inputs.payload.bankName);

    const privateIFSC = this.hash(inputs.payload.ifsc);

    const preparedInputs = {
      privateName,
      publicName: privateName,
      privateBankName,
      publicBankName: privateBankName,
      privateAccountNumber: inputs.payload.accountNumber,
      publicAccountNumber: inputs.payload.accountNumber,
      privateIFSC,
      publicIFSC: privateIFSC,
      message,
      A,
      R8,
      S,
    };

    return preparedInputs;
  }

  private hash(input: string): bigint {
    const hashedInput = crypto
      .createHash(`${process.env.HASH_ALG}`)
      .update(input)
      .digest()
      .toString('hex');

    return BigInt('0x' + hashedInput);
  }

  private calculateStringCharCodeSum(status: string): number {
    let sum = 0;

    for (let i = 0; i < status.length; i++) {
      sum += status.charCodeAt(i);
    }

    return sum;
  }
}
