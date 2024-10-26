import { Test, TestingModule } from '@nestjs/testing';
import { TrscController } from './trsc.controller';
import { TrscService } from './trsc.service';
import { CreateTrscDto } from './dto/create-trsc.dto';
import { NotFoundException } from '@nestjs/common';

describe('TrscController', () => {
  let controller: TrscController;
  let service: TrscService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrscController],
      providers: [
        {
          provide: TrscService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByAccnt: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TrscController>(TrscController);
    service = module.get<TrscService>(TrscService);
  });

  describe('create', () => {
    it('should create a transaction and return it', async () => {
      const dto: CreateTrscDto = { fromAccountId: '1', trscType: 'deposit', amount: 100 };
      const trsc = { id: '123', fromAccountId: '1', trscType: 'deposit', amount: 100 };

      jest.spyOn(service, 'create').mockResolvedValue(trsc as any);
      const result = await controller.create(dto);
      expect(result).toEqual(trsc);
    });
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const transactions = [{ id: '123', amount: 100 }];
      jest.spyOn(service, 'findAll').mockResolvedValue(transactions as any);

      const result = await controller.findAllAccnt();
      expect(result).toEqual(transactions);
    });
  });

  describe('findByAccnt', () => {
    it('should return transactions for an account ID', async () => {
      const transactions = [{ id: '123', amount: 100 }];
      jest.spyOn(service, 'findByAccnt').mockResolvedValue(transactions as any);

      const result = await controller.findByAccnt('123');
      expect(result).toEqual(transactions);
    });

    it('should throw if no transactions found', async () => {
      jest.spyOn(service, 'findByAccnt').mockRejectedValue(new NotFoundException());
      await expect(controller.findByAccnt('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
