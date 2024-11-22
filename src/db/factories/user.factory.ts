import { User } from "@/user/user.entity";
import { faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";

export default setSeederFactory(User, faker => {
    const user = new User();
    user.email = faker.internet.email();
    user.password = 'pw';
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.firstName();
    user.role = 'user';
    user.isActive = true;
    return user;
});
