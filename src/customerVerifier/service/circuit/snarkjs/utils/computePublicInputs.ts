import * as crypto from 'crypto';
import { buildEddsa } from 'circomlibjs';
import 'dotenv/config';

import { Payload } from '../../../../models/payload';
import 'dotenv/config';

export const computeEddsaSigPublicInputs = async (inputs: {
  payload: Payload;
  signature: string;
  publicKey: string;
}) => {
  const eddsa = await buildEddsa();
  const hashedPayload = crypto
    .createHash(`${process.env.HASH_ALG}`)
    .update(JSON.stringify(inputs.payload))
    .digest();

  const packedPublicKey = new Uint8Array(Buffer.from(inputs.publicKey, 'hex'));

  const signature = Uint8Array.from(Buffer.from(inputs.signature, 'hex'));
  const unpackedSignature = eddsa.unpackSignature(signature);

  const packedSignature = eddsa.packSignature(unpackedSignature);

  const messageBits = buffer2bits(hashedPayload);
  const r8Bits = buffer2bits(Buffer.from(packedSignature.slice(0, 32)));
  const sBits = buffer2bits(Buffer.from(packedSignature.slice(32, 64)));
  const aBits = buffer2bits(Buffer.from(packedPublicKey));

  const signatureInputs = {
    message: messageBits,
    A: aBits,
    R8: r8Bits,
    S: sBits,
  };

  return signatureInputs;
};

const buffer2bits = (buffer: Buffer) => {
  const res: bigint[] = [];
  for (let i = 0; i < buffer.length; i++) {
    for (let j = 0; j < 8; j++) {
      if ((buffer[i] >> j) & 1) {
        res.push(BigInt(1));
      } else {
        res.push(BigInt(0));
      }
    }
  }
  return res;
};
