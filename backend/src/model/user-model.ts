import { User } from "@prisma/client";

export type CreateUserRequest = {
    name: string;
    email: string;
    password: string;
    token?: string;
}

export type LoginUserRequest = {
    email: string;
    password: string;
}

export type UserResponse = {
    name: string;
    email: string;
    token?: string;
}

export function toUserResponse(user: User): UserResponse {
    return {
        email: user.email,
        name : user.name
    }
}