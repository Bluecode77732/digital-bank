import { Account } from "@/accnt/account.entity";
import accountFactory from "./account.factory";

describe('Account Factory', () => {
    it('should create a valid Account instance', () => {
        // Create an instance using the factory
        const account = accountFactory();

        expect(account).toBeInstanceOf(Account);
        expect(account.accountNumber).toMatch(/^ACC-\d{6}$/);
        expect(['savings', 'checking', 'investment']).toContain(account.accountType);
        expect(account.balance).toBeGreaterThanOrEqual(0);
        expect(account.balance).toBeLessThanOrEqual(10000);
        expect(account.currency).toBe('USD');
        expect(account.isActive).toBe(true);
    });

    it('should generate unique accounts', () => {
        const accounts = Array.from({ length: 5 }, () => accountFactory());

        expect(accounts.length).toBe(5);
        const uniqueAccountNumbers = new Set(accounts.map(a => a.accountNumber));
        expect(uniqueAccountNumbers.size).toBe(5);
    });
});
