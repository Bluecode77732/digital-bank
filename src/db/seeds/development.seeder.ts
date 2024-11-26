import { Account } from "@/accnt/account.entity";
import { User } from "@/user/user.entity";
import { DataSource } from "typeorm";
import { SeederFactoryManager } from "typeorm-extension";

export default class DevelopmentSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ) : Promise<void> {
        const userFactory = await factoryManager.get(User); //await has no effection indeed lol
        const accountFactory = await factoryManager.get(Account);   //await has no effection indeed lol

        // Create 10 new users
        const users = await userFactory.saveMany(10);

        for(const user of users) {
            //Create 1-3 accounts for each user
            const numberOfAccounts = Math.floor(Math.random() * 3) + 1;
            await accountFactory.map(async (account) => {   //map err caused. #? What is this code? `map(async (account) =>`.
                account.userId = user.id;
                return account;
            })
            .saveMany(numberOfAccounts);
        }
    }
}
