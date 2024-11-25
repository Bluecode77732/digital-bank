import { User } from "@/user/user.entity";
import { setSeederFactory } from "typeorm-extension";

// setting up the seeder factory
export default setSeederFactory(User, faker => {
    const user = new User();
    user.email = faker.internet.email();
    user.password = 'pw';
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.role = 'user';
    user.isActive = true;
    return user;
});
    