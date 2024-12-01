import { Account } from "@/accnt/account.entity";
import { faker } from "@faker-js/faker/.";
// import { setSeederFactory } from "typeorm-extension";

export default function setSeederFactory() : Account {   //#1 Using default is for 'flexible naming', 'single primary export', and the 'simplicity'.
    // Me : Account is just a class but can it be used like new Account()?
    // Peplexity : Yes. To create instances of Account, calling its constructor method to initialize the new object.
    const accnt = new Account();
    accnt.accountNumber = `ACC-${faker.number.int({ min: 100000, max: 999999 })}`;  //The `int` type : int (options?: number | { min?: number; max?: number; }): number
    accnt.accountType = faker.helpers.arrayElement(['savings', 'checking', 'investment']);
    accnt.balance = faker.number.float({ min: 0, max: 10000/* , precision: 0.01  */});
    accnt.currency = 'USD';
    accnt.isActive = true;
    return accnt;
};
