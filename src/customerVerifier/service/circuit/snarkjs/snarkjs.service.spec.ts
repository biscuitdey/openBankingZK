import { SnarkjsCircuitService } from './snarkjs.service';
import { Witness } from '../../../models/witness';
import { ed25519 } from '@noble/curves/ed25519';
import * as circomlib from 'circomlibjs';
import * as crypto from 'crypto';
import 'dotenv/config';
import { Payload } from '../../../models/payload';

jest.setTimeout(40000);
describe('SnarkjsService', () => {
  const snarkjs = new SnarkjsCircuitService();
  let inputs: any;
  let witness: Witness;

  beforeAll(async () => {
    const eddsa = await circomlib.buildEddsa();
    const babyJub = await circomlib.buildBabyjub();
    const privateKey = ed25519.utils.randomPrivateKey();
    const publicKeyPoints = eddsa.prv2pub(privateKey);
    const packedPublicKey = babyJub.packPoint(publicKeyPoints);
    const eddsaPublicKey = Buffer.from(packedPublicKey).toString('hex');

    const payload: Payload = {
      name: 'Biswashree Dey',
      bankName: 'HDFC Bank',
      accountNumber: '524365426544',
      ifsc: 'HDFC1234',
    };

    const hashedPayload = crypto
      .createHash(`${process.env.HASH_ALG}`)
      .update(JSON.stringify(payload))
      .digest();

    const eddsaSignature = eddsa.signPedersen(privateKey, hashedPayload);
    const packedSignature = eddsa.packSignature(eddsaSignature);
    const signature = Buffer.from(packedSignature).toString('hex');

    inputs = { payload, signature, publicKey: eddsaPublicKey };
  });

  it('creates witness for bank proof', async () => {
    const circuitName = 'bankProof';
    const pathToCircuit =
      './zeroKnowledgeArtifacts/circuits/bankProof/bankProof_js/bankProof.wasm';
    const pathToProvingKey =
      './zeroKnowledgeArtifacts/circuits/bankProof/bankProof_final.zkey';
    const pathToVerificationKey =
      './zeroKnowledgeArtifacts/circuits/bankProof/bankProof_verification_key.json';
    const pathToWitnessCalculator =
      '../../../../../zeroKnowledgeArtifacts/circuits/bankProof/bankProof_js/witness_calculator.js';

    const pathToWitnessFile =
      './zeroKnowledgeArtifacts/circuits/bankProof/witness.txt';

    witness = await snarkjs.createWitness(
      inputs,
      circuitName,
      pathToCircuit,
      pathToProvingKey,
      pathToVerificationKey,
      pathToWitnessCalculator,
      pathToWitnessFile,
    );

    console.log(witness);
    expect(typeof witness).toEqual('object');
  });

  it('verifies witness for bankProof', async () => {
    const isVerified = await snarkjs.verifyProofUsingWitness(witness);
    expect(isVerified).toBe(true);
  });

  afterAll(() => {
    globalThis.curve_bn128.terminate();
  });
});
