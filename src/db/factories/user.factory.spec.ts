import { faker } from "@faker-js/faker/.";
import { User } from "@/user/user.entity";
import { setSeederFactory } from "typeorm-extension";

describe('User Factory', () => {
    const createUserFactory = () => {
        return setSeederFactory(User, (faker) => {
            const user = new User();
            user.email = faker.internet.email();
            user.password = 'pw';
            user.firstName = faker.person.firstName();
            user.lastName = faker.person.lastName();
            user.role = 'user';
            user.isActive = true;
            return user;
        });
    };

    it('should create a valid User instance', () => {
        const userFactory = createUserFactory();
        const user = userFactory(faker);

        expect(user).toBeInstanceOf(User);
        expect(user.email).toBeTruthy();
        expect(user.password).toBe('pw');
        expect(user.firstName).toBeTruthy();
        expect(user.lastName).toBeTruthy();
        expect(user.role).toBe('user');
        expect(user.isActive).toBe(true);
    });

    it('should generate unique users', () => {
        const userFactory = createUserFactory();
        const users = Array.from({ length: 5 }, () => userFactory(faker));

        expect(users.length).toBe(5);
        const uniqueEmails = new Set(users.map(u => u.email));
        expect(uniqueEmails.size).toBe(5);
    });
});
