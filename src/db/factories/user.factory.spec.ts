import { User } from "@/user/user.entity";
import userFactory from "./user.factory";
import { faker } from "@faker-js/faker/.";

describe('User Factory', () => {
    it('should create a valid Account instance', () => {
            const user = new User();
            user.email = faker.internet.email();
            user.password = 'pw';
            user.firstName = faker.person.firstName();
            user.lastName = faker.person.lastName();
            user.role = 'user';
            user.isActive = true;
            return user;
        });

    it('should create a valid User instance', () => {
        const user = userFactory();

        expect(user).toBeInstanceOf(User);
        expect(user.email).toBeTruthy();
        expect(user.password).toBe('pw');
        expect(user.firstName).toBeTruthy();
        expect(user.lastName).toBeTruthy();
        expect(user.role).toBe('user');
        expect(user.isActive).toBe(true);
    });

    it('should generate unique users', () => {
        const users = Array.from({ length: 5 }, () => userFactory());

        expect(users.length).toBe(5);
        const uniqueEmails = new Set(users.map(u => u.email));
        expect(uniqueEmails.size).toBe(5);
    });
});
