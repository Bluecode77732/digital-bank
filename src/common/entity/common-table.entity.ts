import { Exclude } from "class-transformer"
import { CreateDateColumn, VersionColumn } from "typeorm";

export class CommonTableEntity {
    // ? Is `@Exclude` need here?
    @Exclude()
    @CreateDateColumn()
    createdAt: Date;
    
    // ? Is `@Exclude` need here?
    @Exclude()
    @CreateDateColumn()
    updatedAt: Date;
    
    // ? Is `@Exclude` need here?
    @Exclude()
    @VersionColumn()
    version: number;
}
