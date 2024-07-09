import yup from "@/core/yup";
import { emailValidator } from "@/helpers/validator";
import { ADMIN_ROLE } from "@/types";

export const UsersValidationSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .required("Email is a required field"),
    role: yup
        .string()
        .trim()
        .required("Role is a required field"),
    name: yup
        .string()
        .trim()
        .required("Name is a required field"),
});

export const roleNameConverter = (role: string) => {
    switch (role) {
        case ADMIN_ROLE.EDITOR:
            return "Admin";
        case ADMIN_ROLE.VIEWER:
            return "Viewer";
        case ADMIN_ROLE.SUPER_ADMIN:
            return "Super Admin";
        default:
            return role;
    }
}

export const isAccountActivated = (status: string, isFactorAuthenticationEnabled: string) => {
    return status?.toLowerCase() === "active" && isFactorAuthenticationEnabled?.toLowerCase() === "active";
}

export const validateEmail = (email: string): string => {
    let errorMessage = '';
    if (!email) {
        errorMessage = 'This field is required';
    } else if (email.length > 320) {
        errorMessage = 'Maximum 320 characters';
    } else if (!emailValidator(email)) {
        errorMessage = 'Invalid email';
    }
    return errorMessage;
}

export const nameValidator = (name: string) => {
    // Only accept English alphabet, number, and space
    const regex = /^[a-zA-Z0-9 ]+$/;
    return regex.test(name);
}

export const validateFullName = (fullName: string | undefined | null): string => {
    let errorMessage = '';
    if (!fullName) {
        errorMessage = 'This field is required';
    } else if (fullName.length > 30) {
        errorMessage = 'Maximum 30 characters';
    } else if (!nameValidator(fullName)) {
        errorMessage = 'Only English characters, numbers, and spaces are allowed';
    }
    return errorMessage;
}