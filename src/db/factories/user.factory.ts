import { User } from "@/user/user.entity";
import { faker } from "@faker-js/faker/.";
// import { setSeederFactory } from "typeorm-extension"; removing setSeederFactory.

// setting up the seeder factory
export default function userFactory() : User {
    const user = new User();
    user.email = faker.internet.email();
    user.password = 'pw';
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.role = 'user';
    user.isActive = true;
    return user;
};
