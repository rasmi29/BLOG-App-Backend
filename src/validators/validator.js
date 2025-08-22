import { body } from "express-validator";

const userRegistrationValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("email is required")
            .isEmail()
            .withMessage("Valid email required"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("username is required")
            .isLength({ min: 4 })
            .withMessage("username min-length should be 4")
            .isLength({ max: 13 })
            .withMessage("username max-length should be 13"),

        body("password")
            .trim()
            .notEmpty()
            .withMessage("password can not be empty")
            .isLength({ min: 6 })
            .withMessage("password length should be min of 6 character"),
    ];
};

const userLoginValidator = () => {
    return [
        body("email")
            .notEmpty()
            .withMessage("email is required")
            .isEmail()
            .withMessage("valid email is required"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("password can not be empty")
            .isLength({ min: 6 })
            .withMessage("password length should be min of 6 character"),
    ];
};

export { userRegistrationValidator, userLoginValidator };
