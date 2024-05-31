import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 } from 'uuid';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggingModule } from '../../shared/logging/logging.module';
import { CreateProofCommandHandler } from '../capabilities/createProof/createProofCommand.handler';
import { CreateProofDto } from './dtos/request/createProof.dto';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { CustomerVerifierController } from './customerVerifier.controller';
import { CustomerVerifierStorageAgent } from '../agents/customerVerifierStorage.agent';
import { CustomerVerifierAgent } from '../agents/customerVerifier.agent';
import { SnarkjsCircuitService } from '../service/circuit/snarkjs/snarkjs.service';
import { CustomerVerifierProfile } from '../customerVerifier.profile';
import { CustomerVerifier } from '../models/customerVerifier';
import { ed25519 } from '@noble/curves/ed25519';
import * as circomlib from 'circomlibjs';
import * as crypto from 'crypto';
import { Proof } from '../models/proof';
import { INVALID_SIGNATURE } from './err.messages';
import { PublicWitness } from '../models/publicWitness';

describe('CustomerVerifierController', async () => {
  let vController: CustomerVerifierController;
  let customerVerifierStorageAgentMock: DeepMockProxy<CustomerVerifierStorageAgent>;

  let existingCustomerVerifier: CustomerVerifier;
  const privateKey =
    'b5c90be10dc9e28540d9a5bc4e5b045514de86d7ca5c89dab68c4986f7fc17bf';
  const publicKey =
    'e8e391fec51831b677fc5658f91be28fc422320b810d9eae94a6b3acba67a31f';

  const signature =
    'd41ab9493e024df21c56327e98f390209f550a529f692f97a2f1a30cc9a76e83062abcb6609f0155aecffca26757e862145bb4e2377921a9487b425a243d1204';

  const proof = {
    value: {
      A: [
        '17988788482483610602625948405788680786155763106929166591292026448090960242671',
        '15794741543006481170543439485223338165376490423046930541491261184385629782821',
        '1',
      ],
      B: [
        '20462404606072535420430506393372611500499860409510870130658622498891373684756',
        '9004307815097949735395182446920106091233471239246122316213787576433601686263',
        '1',
      ],
      C: [
        '17775171843106535795335476855815810532541723833627612099615528020475481308977',
        '18883243256704757301686203270946349840391064361783611974048751234744971087972',
        '1',
      ],
      Z: [
        '4160391404410260159821048675946521796404565780242650089008882771149972218537',
        '7178483628907649107453527454833751812862740899465258418841513999299461587755',
        '1',
      ],
      T1: [
        '20330517428579566459193003373480390964472773355904165296309948016743466996781',
        '3861475257151136143593231934607863279889304780614303616526194133850817919292',
        '1',
      ],
      T2: [
        '1580001569883077404048112597742578298308905764989822677429747444929455860952',
        '10007702651306093541095695802671075893005176442161716802144616781421861627731',
        '1',
      ],
      T3: [
        '10649112129824935159661929797708405839194525680641501922667396387959764326206',
        '17601422345937895534773621664972356268195277596188295582090578793321622408734',
        '1',
      ],
      Wxi: [
        '6198026880001879056305619200458533591093555659180666121756896860284711272912',
        '7762494900806500987758742322344098256204500507837939199058162017286233816502',
        '1',
      ],
      Wxiw: [
        '8887871542246742812795416829862688128746952867160769411320792161121375606168',
        '15541577068974363213240502191911154674348614204591189868616586556072237849396',
        '1',
      ],
      eval_a:
        '5443358696530695480044932139925322638764534021023292601256438532758479873638',
      eval_b:
        '20393342091755652805320950157195788487740084303262587136421506905321786187405',
      eval_c:
        '16245796166001274026858085792388234399345509781957039841566785384867312042841',
      eval_s1:
        '7446323678996679051115206009494205800602282330231426326258911975399013491868',
      eval_s2:
        '424101131439278763014850543970229914603754425148991407387000994142093459647',
      eval_zw:
        '19598467500658403573750586329758488237046031305743607055294829570969814111043',
      protocol: 'plonk',
      curve: 'bn128',
    },
    protocol: 'plonk',
    curve: 'bn128',
  } as Proof;

  const publicInputs = [
    '1',
    '1917185708455983382989841109461256689669653365482280287163877940782867490426',
    '8261631195034831203782766314879973243550406223964187274064739622565109609868',
    '524365426544',
    '1413127536459907793539064849240006432957482493878678732997135829127671145302',
  ];

  const verificationKey = {
    protocol: 'plonk',
    curve: 'bn128',
    nPublic: 5,
    power: 15,
    k1: '2',
    k2: '3',
    Qm: [
      '2613363480272284158768583760143187693143268210347218954303865150307379653347',
      '8664108502761579462443987042653745571042343539766668326337187509720701133950',
      '1',
    ],
    Ql: [
      '10279334263956210347187331595933052028772710060589819435556347831109134893050',
      '13067425314615632191357660164713508333378022428142953090521532889451431292761',
      '1',
    ],
    Qr: [
      '443283832003513517090776218779266598682922576370745385109960142253005177449',
      '13304972866037783836380204775498303754608358642235420547402212698268998531698',
      '1',
    ],
    Qo: [
      '2591619833869146968970496110581211316853749109583070844542597824121521761888',
      '10740673581547438713860973245929696818910468396416766400722323693311452795153',
      '1',
    ],
    Qc: [
      '6631793330534842268870360317653912816160019990570263176522606100143360424901',
      '12782354789194382556781925347075924765137414508564200721043150647484728109191',
      '1',
    ],
    S1: [
      '2462617628800447954857159617608127544228526026868960179058317347167169134014',
      '8766604811711413830867800785857564225595139163031426137375431802727398615338',
      '1',
    ],
    S2: [
      '19843691365309890449902890179331939568892782005028496192110914386931217544537',
      '11198103737741832770823862144194577236798547974481769058027535632910757068457',
      '1',
    ],
    S3: [
      '2184737399308045276331426439485766175901306652641890156881179302425060289116',
      '611936459578962713839051173627704124330683739880867914551596021493408963185',
      '1',
    ],
    X_2: [
      [
        '2321988474491776629155900984851194893971237617236929854000669698106251294482',
        '15399370655519668364856725059220045809711300771488808988180462594575219405896',
      ],
      [
        '9100548190780865726985833185894271997239588989481655992514276604785307114994',
        '6686777721814013284769376232209626585370336594432716309332101533508462474974',
      ],
      ['1', '0'],
    ],
    w: '20402931748843538985151001264530049874871572933694634836567070693966133783803',
  };

  existingCustomerVerifier = new CustomerVerifier(v4(), publicKey, proof);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        LoggingModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      controllers: [CustomerVerifierController],
      providers: [
        CustomerVerifierAgent,
        CustomerVerifierStorageAgent,
        CreateProofCommandHandler,
        {
          provide: 'ICircuitService',
          useClass: SnarkjsCircuitService,
        },
        CustomerVerifierProfile,
      ],
    })
      .overrideProvider(CustomerVerifierStorageAgent)
      .useValue(mockDeep<CustomerVerifierStorageAgent>())
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    vController = app.get<CustomerVerifierController>(
      CustomerVerifierController,
    );
    customerVerifierStorageAgentMock = app.get(CustomerVerifierStorageAgent);

    await app.init();
  });

  describe('createProof', () => {
    it('should throw Unauthorized if signature with invalid format provided', () => {
      // Arrange
      const requestDto = {
        payload: {
          name: 'Biswashree Dey',
          bankName: 'HDFC Bank',
          accountNumber: '524365426544',
          ifsc: 'HDFC1234',
        },
        signature: '213432',
        publicKey,
      } as CreateProofDto;

      customerVerifierStorageAgentMock.storeCustomerVerifier.mockResolvedValueOnce(
        existingCustomerVerifier,
      );

      // Act and assert
      expect(async () => {
        await vController.createProof(requestDto);
      }).rejects.toThrow(new UnauthorizedException(INVALID_SIGNATURE));
    });

    it('should throw Unauthorized if signature with valid format that does not fit with the public key of the sender is provided', () => {
      // Arrange
      const requestDto = {
        payload: {
          name: 'Biswashree Dey',
          bankName: 'HDFC Bank',
          accountNumber: '524365426544',
          ifsc: 'HDFC1234',
        },
        signature,
        publicKey: '342354',
      } as CreateProofDto;

      customerVerifierStorageAgentMock.storeCustomerVerifier.mockRejectedValueOnce(
        requestDto,
      );

      // Act and assert
      expect(async () => {
        await vController.createProof(requestDto);
      }).rejects.toThrow(new UnauthorizedException(INVALID_SIGNATURE));
    });

    it('should return new uuid from the created bpi message when all params provided', async () => {
      // Arrange
      const requestDto = {
        payload: {
          name: 'Biswashree Dey',
          bankName: 'HDFC Bank',
          accountNumber: '524365426544',
          ifsc: 'HDFC1234',
        },
        signature,
        publicKey,
      } as CreateProofDto;

      const expectedResponse = {
        publicInputs,
        verificationKey,
      } as PublicWitness;
      customerVerifierStorageAgentMock.storeCustomerVerifier.mockResolvedValueOnce(
        existingCustomerVerifier,
      );

      // Act
      const response = await vController.createProof(requestDto);

      // Assert
      expect(response.publicInputs).toEqual(expectedResponse.publicInputs);
    });
  });

  describe('verifyProof', () => {
    it('should throw NotFound if non existent public key passed', () => {
      // Arrange
      const nonExistentPk = '123';
      verifierStorageAgentMock.getCustomerVerifierByPublicKey.mockResolvedValueOnce(
        undefined,
      );

      // Act and assert
      expect(async () => {
        await vController.verifyProof(nonExistentPk);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should verify customer details if proper public key is passed ', async () => {
      // Arrange
      verifierStorageAgentMock.getCustomerVerifierByPublicKey.mockResolvedValueOnce(
        existingCustomerVerifier,
      );

      // Act
      const isVerifiedCustomerProof = await vController.verifyProof(
        existingPublicWitness,
      );

      // Assert
      expect(isVerifiedCustomerProof).toEqual(true);
    });
  });
});
