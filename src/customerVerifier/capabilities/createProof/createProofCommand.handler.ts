import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProofAgent } from '../../agents/customerVerifier.agent';
import { CreateProofCommand } from './createProof.command';
import { Witness } from '../../models/witness';

@CommandHandler(CreateProofCommand)
export class CreateProofCommandHandler
  implements ICommandHandler<CreateProofCommand>
{
  constructor(private readonly agent: ProofAgent) {}

  async execute(command: CreateProofCommand) {
    this.agent.throwIfSignatureVerificationFails(
      JSON.stringify(command.payload),
      command.signature,
      command.publicKey,
    );

    const witness: Witness = await this.agent.createProofWitness(
      command.payload,
      command.signature,
      command.publicKey,
    );

    return witness;
  }
}
