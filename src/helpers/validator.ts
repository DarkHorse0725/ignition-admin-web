import yup from "@/core/yup";

export const emailValidator = (email: string) => {
    const schema = yup.string().email();

    const regex = /^[a-zA-Z0-9]+([._+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;

    return schema.isValidSync(email) && regex.test(email);
}
