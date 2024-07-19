import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE } from '../../err.messages';
import { CreateCertificateDto } from './createCertificate.dto';

describe('CreateCertificateDto', () => {
  it('should return error in case id not provided.', async () => {
    // Arrange
    const dto = {
      payload: {
        bankName: 'def',
        accountNumber: '123',
        ifsc: '456',
      },
      signature: '123456',
      publicKey: '654321',
    };
    const createCertificateDto = plainToInstance(CreateCertificateDto, dto);

    // Act
    const errors = await validate(createCertificateDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].children[0].property).toEqual('name');
    expect(errors[0].children[0].constraints?.isNotEmpty).toContain(
      SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE('name'),
    );
  });

  it('should return error in case bank name not provided.', async () => {
    // Arrange
    const dto = {
      payload: {
        name: 'abc',
        accountNumber: '123',
        ifsc: '456',
      },
      signature: '123456',
      publicKey: '654321',
    };
    const createCertificateDto = plainToInstance(CreateCertificateDto, dto);

    // Act
    const errors = await validate(createCertificateDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].children[0].property).toEqual('bankName');
    expect(errors[0].children[0].constraints?.isNotEmpty).toContain(
      SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE('bankName'),
    );
  });

  it('should return error in case account number not provided.', async () => {
    // Arrange
    const dto = {
      payload: {
        name: 'abc',
        bankName: 'def',
        ifsc: '456',
      },
      signature: '123456',
      publicKey: '654321',
    };
    const createCertificateDto = plainToInstance(CreateCertificateDto, dto);

    // Act
    const errors = await validate(createCertificateDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].children[0].property).toEqual('accountNumber');
    expect(errors[0].children[0].constraints?.isNotEmpty).toContain(
      SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE('accountNumber'),
    );
  });

  it('should return error in case ifsc not provided.', async () => {
    // Arrange
    const dto = {
      payload: {
        name: 'abc',
        bankName: 'def',
        accountNumber: '123',
      },
      signature: '123456',
      publicKey: '654321',
    };
    const createCertificateDto = plainToInstance(CreateCertificateDto, dto);

    // Act
    const errors = await validate(createCertificateDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].children[0].property).toEqual('ifsc');
    expect(errors[0].children[0].constraints?.isNotEmpty).toContain(
      SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE('ifsc'),
    );
  });

  it('should return error in case signature not provided.', async () => {
    // Arrange
    const dto = {
      payload: {
        name: 'abc',
        bankName: 'def',
        accountNumber: '123',
        ifsc: '456',
      },
      publicKey: '654321',
    };
    const createCertificateDto = plainToInstance(CreateCertificateDto, dto);

    // Act
    const errors = await validate(createCertificateDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('signature');
    expect(errors[0].constraints?.isNotEmpty).toContain(
      SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE('signature'),
    );
  });

  it('should return error in case public key not provided.', async () => {
    // Arrange
    const dto = {
      payload: {
        name: 'abc',
        bankName: 'def',
        accountNumber: '123',
        ifsc: '456',
      },
      signature: '123456',
    };
    const createCertificateDto = plainToInstance(CreateCertificateDto, dto);

    // Act
    const errors = await validate(createCertificateDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('publicKey');
    expect(errors[0].constraints?.isNotEmpty).toContain(
      SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE('publicKey'),
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = {
      payload: {
        name: 'abc',
        bankName: 'def',
        accountNumber: '123',
        ifsc: '456',
      },
      signature: '123456',
      publicKey: '654321',
    };
    const createCertificateDto = plainToInstance(CreateCertificateDto, dto);

    // Act
    const errors = await validate(createCertificateDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
