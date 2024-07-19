import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomerVerifierAgent } from '../../agents/customerVerifier.agent';
import { VerifyCertificateCommand } from './verifyCertificate.command';
import { Witness } from '../../models/witness';
import { CustomerVerifierStorageAgent } from '../../agents/customerVerifierStorage.agent';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';

@CommandHandler(VerifyCertificateCommand)
export class VerifyCertificateCommandHandler
  implements ICommandHandler<VerifyCertificateCommand>
{
  constructor(
    private readonly agent: CustomerVerifierAgent,
    private readonly storageAgent: CustomerVerifierStorageAgent,
  ) {}

  async execute(command: VerifyCertificateCommand) {
    try {
      const customerVerifier =
        await this.storageAgent.getCustomerVerifierByPublicKey(
          command.publicKey,
        );

      if (!customerVerifier) {
        throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
      }

      const witness = {
        certificate: customerVerifier.certificate,
        publicInputs: command.publicWitness.publicInputs,
        verificationKey: command.publicWitness.verificationKey,
      } as Witness;

      return await this.agent.verifyCertificateWitness(witness);
    } catch (error) {
      return error;
    }
  }
}
