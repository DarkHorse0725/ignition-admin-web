import yup from "@/core/yup";
import countryList from 'react-select-country-list';

const countries = countryList().getLabels();

export const CustomerValidationSchema = yup.object({
    email: yup.string().email('Invalid email format').required(),
    password: yup
        .string()
        .min(
            6,
            'password must have a minimum length of 6 characters. We highly recommend password managers.'
        ),
    brand: yup.string().required(),
    name: yup.string().min(2).required(),
    surname: yup.string().min(3).required(),
    countryCode: yup
        .string()
        .length(3, 'Length must be 3 characters.')
        .required('country code a required field'),
    country: yup.object({
        name: yup
            .mixed()
            .defined('country name is a required field')
            .oneOf(countries, 'Please input correct country name'),
        code3: yup.number(),
    }),
    address: yup.string().min(10).required(),
    addressTwo: yup.string(),
    province: yup.string().required(),
    city: yup.string().required().min(2),
    status: yup.number().required(),
    telegram: yup.string(),
    synapsSessionId: yup.string(),
    solanaAddress: yup.string(),
    changePasswordNextLogin: yup.boolean(),
});
