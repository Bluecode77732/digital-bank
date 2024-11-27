import { Account } from "@/accnt/account.entity";
import { User } from "@/user/user.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

export default class DevelopmentSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ) : Promise<void> {
        try {
            const userFactory = await factoryManager.get(User); //await has no effection indeed lol
            const accountFactory = await factoryManager.get(Account);   //await has no effection indeed lol
            
            // Create 10 new users
            const numberOfUsers = 10;
            const users = await userFactory.saveMany(numberOfUsers);
            
            // Create accounts for each user
            const accntPromises = users.flatMap(user) => {
                // Randomly create number of accounts 
                const numberOfAccounts = Math.floor(Math.random() * 3) + 1;
                
                return Array.from({ length: numberOfAccounts }, () => 
                    accountFactory.save({ 
                        userId : userFactory.id
                        user: userFactory.
                    })
                );
                /* await accountFactory.create {   */ //map err caused. #? What is this code? `map(async (account) =>`.
            } 
        }
        await Promise.all(accntPromises);
    }
}
