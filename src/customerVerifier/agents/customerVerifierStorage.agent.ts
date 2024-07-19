import { Injectable } from '@nestjs/common';
import { PrismaMapper } from '../../shared/prisma/prisma.mapper';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CustomerVerifier } from '../models/customerVerifier';

@Injectable()
export class CustomerVerifierStorageAgent {
  constructor(
    private readonly mapper: PrismaMapper,
    private readonly prisma: PrismaService,
  ) {}

  async getCustomerVerifierById(
    id: string,
  ): Promise<CustomerVerifier | undefined> {
    let customerVerifierRecord = await this.prisma.customerVerifier.findUnique({
      where: { id },
    });

    if (!customerVerifierRecord) {
      return undefined;
    }

    customerVerifierRecord = {
      ...customerVerifierRecord,
      certificate: JSON.parse(customerVerifierRecord.certificate),
    };

    const customerVerifier = this.mapper.map(
      customerVerifierRecord,
      CustomerVerifier,
    );

    return customerVerifier;
  }

  async getCustomerVerifierByPublicKey(
    publicKey: string,
  ): Promise<CustomerVerifier | undefined> {
    let customerVerifierRecord = await this.prisma.customerVerifier.findUnique({
      where: { publicKey },
    });

    if (!customerVerifierRecord) {
      return undefined;
    }

    customerVerifierRecord = {
      ...customerVerifierRecord,
      certificate: JSON.parse(customerVerifierRecord.certificate),
    };

    const customerVerifier = this.mapper.map(
      customerVerifierRecord,
      CustomerVerifier,
    );

    return customerVerifier;
  }

  async storeCustomerVerifier(
    verifier: CustomerVerifier,
  ): Promise<CustomerVerifier> {
    const customerVerifierRecord = await this.prisma.customerVerifier.create({
      data: {
        id: verifier.id,
        publicKey: verifier.publicKey,
        certificate: JSON.stringify(verifier.certificate),
      },
    });

    return this.mapper.map(customerVerifierRecord, CustomerVerifier);
  }

  async updateCustomerVerifier(
    verifier: CustomerVerifier,
  ): Promise<CustomerVerifier> {
    const updatedCustomerVerifierRecord =
      await this.prisma.customerVerifier.update({
        where: { publicKey: verifier.publicKey },
        data: {
          id: verifier.id,
          publicKey: verifier.publicKey,
          certificate: JSON.stringify(verifier.certificate),
        },
      });

    return this.mapper.map(updatedCustomerVerifierRecord, CustomerVerifier);
  }

  async deleteCustomerVerifier(verifier: CustomerVerifier): Promise<void> {
    await this.prisma.customerVerifier.delete({
      where: { id: verifier.id },
    });
  }
}
