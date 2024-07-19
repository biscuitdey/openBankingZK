import { Witness } from '../../models/witness';

export interface ICircuitService {
  createWitness(
    inputs: object,
    circuitName: string,
    pathToCircuit: string,
    pathToProvingKey: string,
    pathToVerificationKey: string,
    pathToWitnessCalculator?: string,
    pathToWitnessFile?: string,
  ): Promise<Witness>;
  verifyCertificateUsingWitness(witness: Witness): Promise<boolean>;
}
