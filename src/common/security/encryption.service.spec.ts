import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';
import { LoggingService } from '../logging/logging.service';
import { createMock } from '@golevelup/ts-jest';

describe('EncryptionService', () => {
    let service: EncryptionService;
    let loggingService: jest.Mocked<LoggingService>;

    beforeEach(async () => {
        // Clear mock calls before each test
        jest.clearAllMocks();
        
        loggingService = createMock<LoggingService>();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: EncryptionService,
                    useFactory: () => new EncryptionService(
                        // createMock<LoggingService>(),
                        loggingService,
                        { encryptionKey: 'test-key-32-chars-long-for-testing' },
                    ),
                },
                {
                    provide: LoggingService,
                    useValue: loggingService,
                    // useValue: createMock<LoggingService>(),
                },
            ],
        }).compile();

        service = module.get<EncryptionService>(EncryptionService);
        // loggingService = module.get(LoggingService);
    });

    it('should encrypt and decrypt data', async () => {
        const testData = 'sensitive data';
        const encrypted = await service.encrypt(testData);
        expect(typeof encrypted).toBe('string');

        const decrypted = await service.decrypt(encrypted);
        expect(decrypted).toBe(testData);
    });

    it('should throw on decryption failure', async () => {
        // Set up logging service mock to verify err is logged
        loggingService.error.mockImplementation(() => {});

        // const errorSpy = jest.spyOn(loggingService, 'error');
        
        

        await expect(service.decrypt('invalid-data'))
            .rejects.toThrowError(TypeError);

        // Verify that err was logged
        expect(loggingService.error).toHaveBeenCalledWith(
            'Decryption failed', 
            expect.objectContaining({
                message : 'Invalid initialization vector',
            })


        /* expect(loggingService.error).toHaveBeenCalledWith(
            'Decryption failed', 
            expect.any(TypeError) */
        );
    });
});
