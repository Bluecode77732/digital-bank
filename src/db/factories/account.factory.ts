import { Account } from "@/accnt/account.entity";
import { faker } from "@faker-js/faker/.";
import { setSeederFactory } from "typeorm-extension";

export default setSeederFactory(Account, (faker) => {   //#1 Using default is for 'flexible naming', 'single primary export', and the 'simplicity'.
    // Me : Account is just a class but can it be used like new Account()?
    // Peplexity : Yes. To create instances of Account, calling its constructor method to initialize the new object.
    const accnt = new Account();
    return accnt;
});
    