import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';
import { LoggingService } from '../logging/logging.service';
import { createMock } from '@golevelup/ts-jest';

describe('EncryptionService', () => {
    let service: EncryptionService;
    let loggingService: jest.Mocked<LoggingService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: EncryptionService,
                    useFactory: () => new EncryptionService(
                        createMock<LoggingService>(),
                        { encryptionKey: 'test-key-32-chars-long-for-testing' },
                    ),
                },
                {
                    provide: LoggingService,
                    useValue: createMock<LoggingService>(),
                },
            ],
        }).compile();

        service = module.get<EncryptionService>(EncryptionService);
        loggingService = module.get(LoggingService);
    });

    it('should encrypt and decrypt data', async () => {
        const testData = 'sensitive data';
        const encrypted = await service.encrypt(testData);
        expect(typeof encrypted).toBe('string');

        const decrypted = await service.decrypt(encrypted);
        expect(decrypted).toBe(testData);
    });

    it('should throw on decryption failure', async () => {
        await expect(service.decrypt('invalid-data'))
            .rejects.toThrow('Decryption failed');
        expect(loggingService.error).toHaveBeenCalled();
    });
});
