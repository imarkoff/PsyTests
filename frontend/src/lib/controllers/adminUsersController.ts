"use server";

import UserCreate from "@/types/forms/UserCreate";
import {fetchProtected} from "@/lib/fetchers";
import AdminUsersService from "@/lib/services/AdminUsersService";
import {AxiosError} from "axios";
import {UserUpdateDto} from "@/types/forms/UserUpdate";

export const createUser = async (
    userCreate: UserCreate
) => fetchProtected(
    AdminUsersService,
    async (service) => {
        try {
            return await service.createUser(userCreate)
        }
        catch (error) {
            if (error instanceof AxiosError && error.response?.status === 409) {
                throw new Error("Користувач з таким номером телефону вже існує");
            }
            throw error;
        }
    }
);

export const getUser = async (
    id: string
) => fetchProtected(
    AdminUsersService,
    service => service.getUser(id)
);

export const updateUser = async (
    id: string,
    userUpdate: UserUpdateDto,
) => fetchProtected(
    AdminUsersService,
    service => service.updateUser(id, userUpdate)
);