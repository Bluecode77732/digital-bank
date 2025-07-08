export type ID_TYPE = string;
export type Username_TYPE = string;
export type Email_TYPE = string;
export type Password_TYPE = string;
export type Role_TYPE = string;
export type IsActive_TYPE = boolean;
export type FirstName_TYPE = string;
export type LastName_TYPE = string;
export type Created_At_TYPE = Date;
export type Updated_At_TYPE = Date;
export type Amount_TYPE = number;

export enum Enum { };

export interface Interface_Type {
    id: ID_TYPE;
    user: Username_TYPE;
    createdAt: Created_At_TYPE;
    updatedAt: Updated_At_TYPE;
}
