/**
 * Certificate represents a typical zero knowledge certificate.
 * Groth16 uses pairing-friendly elliptic curves - G1 and G2.
 * a, c are elements on G1 and b is an element on G2.
 * The variables are named as per zk convention.
 */

export class Certificate {
  value: object;
  protocol?: string;
  curve?: string;
}
