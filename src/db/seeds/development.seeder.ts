import { Account } from "@/accnt/account.entity";
import { User } from "@/user/user.entity";
import { faker } from "@faker-js/faker/.";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

export default class DevelopmentSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ) : Promise<void> {
        try {
            const userFactory = factoryManager.get(User); //These methods are synchronous, so no need for await.
            const accountFactory = factoryManager.get(Account);   //await has no effection indeed lol
            
            // Create 10 new users
            const numberOfUsers = 10;
            const users = await userFactory.saveMany(numberOfUsers);
            
            // Create accounts for each user
            const accountPromises = users.flatMap((user) => {
                // Randomly create number of accounts 
                const numberOfAccounts = faker.number.int({ min: 1, max: 3});
                
                return Array.from({ length: numberOfAccounts }, () => 
                    accountFactory.save({ 
                        // Keeping relationship with Account columns.
                        id : user.id,
                        accountNumber : faker.finance.accountNumber(),
                        accountType : faker.helpers.arrayElement(['savings', 'checking', 'investment']),
                        balance : faker.finance.amount(),
                        currency : 'USD',
                        isActive : true,
                    })
                );
            });
            await Promise.all(accountPromises);
        } catch(err) {
            console.error('error', err);
            throw err;
        }
    }
}
