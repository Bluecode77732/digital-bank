import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

@Injectable()
export class EncryptionService {
    private readonly algorithm = 'aes-256-cbc';
    private readonly secretKey = process.env.ENCRYPTION_KEY || 'default_key';
    private readonly ivLength = 16;

    encrypt(text: string): string {
        const iv = crypto.randomBytes(this.ivLength);
        const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secretKey), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    }

    decrypt(encryptedText: string): string {
        const [iv, encrypted] = encryptedText.split(':').map(part => Buffer.from(part, 'hex'));
        const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.secretKey), iv);
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
