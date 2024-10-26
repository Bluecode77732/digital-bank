import { Test, TestingModule } from '@nestjs/testing';
import { TrscService } from './trsc.service';

describe('TrscService', () => {
    let provider: TrscService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TrscService],
        }).compile();

        provider = module.get<TrscService>(TrscService);
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
    });
});
