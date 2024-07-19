import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomerVerifierAgent } from '../../agents/customerVerifier.agent';
import { CreateCertificateCommand } from './createCertificate.command';
import { Witness } from '../../models/witness';
import { CustomerVerifierStorageAgent } from '../../agents/customerVerifierStorage.agent';
import { CustomerVerifier } from '../../models/customerVerifier';
import { PublicWitness } from '../../models/publicWitness';

@CommandHandler(CreateCertificateCommand)
export class CreateCertificateCommandHandler
  implements ICommandHandler<CreateCertificateCommand>
{
  constructor(
    private readonly agent: CustomerVerifierAgent,
    private readonly storageAgent: CustomerVerifierStorageAgent,
  ) {}

  async execute(command: CreateCertificateCommand) {
    try {
      await this.agent.throwIfSignatureVerificationFails(
        JSON.stringify(command.payload),
        command.signature,
        command.publicKey,
      );

      const witness: Witness = await this.agent.createCertificateWitness(
        command.payload,
        command.signature,
        command.publicKey,
      );

      const customerVerfier: CustomerVerifier =
        await this.agent.createCustomerVerifier(
          command.publicKey,
          witness.certificate,
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
