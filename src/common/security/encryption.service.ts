// security/encryption.service.ts
import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class EncryptionService {
    private readonly algorithm = 'aes-256-gcm';
    private readonly keyLength = 32;
    private readonly ivLength = 16;
    private readonly saltLength = 32;
    private readonly authTagLength = 16;

    constructor(
        private readonly loggingService: LoggingService,
        private readonly config: {
            encryptionKey: string;
        },
    ) { }

    async encrypt(data: string): Promise<string> {
        try {
            const salt = randomBytes(this.saltLength);
            const iv = randomBytes(this.ivLength);

            const key = await promisify(scrypt)(
                this.config.encryptionKey,
                salt,
                this.keyLength,
            ) as Buffer;

            const cipher = createCipheriv(this.algorithm, key, iv, {
                authTagLength: this.authTagLength,
            });

            const encrypted = Buffer.concat([
                cipher.update(data, 'utf8'),
                cipher.final(),
            ]);

            const authTag = cipher.getAuthTag();

            const result = Buffer.concat([
                salt,
                iv,
                authTag,
                encrypted,
            ]).toString('base64');

            return result;
        } catch (error) {
            this.loggingService.error('Encryption failed', { error });
            throw new Error('Encryption failed');
        }
    }

    async decrypt(encryptedData: string): Promise<string> {
        try {
            const buffer = Buffer.from(encryptedData, 'base64');

            const salt = buffer.subarray(0, this.saltLength);
            const iv = buffer.subarray(this.saltLength, this.saltLength + this.ivLength);
            const authTag = buffer.subarray(
                this.saltLength + this.ivLength,
                this.saltLength + this.ivLength + this.authTagLength,
            );
            const encrypted = buffer.subarray(this.saltLength + this.ivLength + this.authTagLength);

            const key = await promisify(scrypt)(
                this.config.encryptionKey,
                salt,
                this.keyLength,
            ) as Buffer;

            const decipher = createDecipheriv(this.algorithm, key, iv, {
                authTagLength: this.authTagLength,
            });
            decipher.setAuthTag(authTag);

            const decrypted = Buffer.concat([
                decipher.update(encrypted),
                decipher.final(),
            ]);

            return decrypted.toString('utf8');
        } catch (error) {
            this.loggingService.error('Decryption failed', { error } ); // { error } is shorthand for { error: error }
            throw new Error('Decryption failed');
        }
    }
}


/* import { Injectable } from "@nestjs/common";
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
} */
