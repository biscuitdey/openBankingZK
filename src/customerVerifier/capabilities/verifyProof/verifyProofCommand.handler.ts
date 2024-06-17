import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomerVerifierAgent } from '../../agents/customerVerifier.agent';
import { VerifyProofCommand } from './verifyProof.command';
import { Witness } from '../../models/witness';
import { CustomerVerifierStorageAgent } from '../../agents/customerVerifierStorage.agent';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';

@CommandHandler(VerifyProofCommand)
export class VerifyProofCommandHandler
  implements ICommandHandler<VerifyProofCommand>
{
  constructor(
    private readonly agent: CustomerVerifierAgent,
    private readonly storageAgent: CustomerVerifierStorageAgent,
  ) {}

  async execute(command: VerifyProofCommand) {
    try {
      const customerVerifier =
        await this.storageAgent.getCustomerVerifierByPublicKey(
          command.publicKey,
        );

      if (!customerVerifier) {
        throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
      }

      const witness = {
        proof: customerVerifier.proof,
        publicInputs: command.publicWitness.publicInputs,
        verificationKey: command.publicWitness.verificationKey,
      } as Witness;

      return await this.agent.verifyProofWitness(witness);
    } catch (error) {
      return error;
    }
  }
}
