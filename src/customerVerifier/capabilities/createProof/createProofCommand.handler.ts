import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomerVerifierAgent } from '../../agents/customerVerifier.agent';
import { CreateProofCommand } from './createProof.command';
import { Witness } from '../../models/witness';
import { CustomerVerifierStorageAgent } from '../../agents/customerVerifierStorage.agent';
import { CustomerVerifier } from '../../models/customerVerifier';
import { PublicWitness } from '../../models/publicWitness';

@CommandHandler(CreateProofCommand)
export class CreateProofCommandHandler
  implements ICommandHandler<CreateProofCommand>
{
  constructor(
    private readonly agent: CustomerVerifierAgent,
    private readonly storageAgent: CustomerVerifierStorageAgent,
  ) {}

  async execute(command: CreateProofCommand) {
    try {
      await this.agent.throwIfSignatureVerificationFails(
        JSON.stringify(command.payload),
        command.signature,
        command.publicKey,
      );

      const witness: Witness = await this.agent.createProofWitness(
        command.payload,
        command.signature,
        command.publicKey,
      );

      const customerVerfier: CustomerVerifier =
        await this.agent.createCustomerVerifier(
          command.publicKey,
          witness.proof,
        );

      await this.storageAgent.storeCustomerVerifier(customerVerfier);

      const publicWitness: PublicWitness =
        await this.agent.getPublicWitness(witness);

      return publicWitness;
    } catch (error) {
      return error;
    }
  }
}
