const { body } = require("express-validator");

exports.registerValidations = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 1 })
    .withMessage("name minimum 1 character")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("name can only contain letters and spaces"),

  body("lastname")
    .notEmpty()
    .withMessage("lastname is required")
    .isLength({ min: 1 })
    .withMessage("lastname minimum 1 character")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("lastname can only contain letters and spaces"),

  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email"),

  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password minimum 8 character")
    .matches(/^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage("password must contain at least one special character")
    .matches(/\d/)
    .withMessage("password must contain at least one number")
    .matches(/[a-z]/)
    .withMessage("password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("password must contain at least one capital letter"),
];

exports.loginValidations = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email"),
];

exports.changePasswordValidator = [
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password minimum 8 character")
    .matches(/^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage("password must contain at least one special character")
    .matches(/\d/)
    .withMessage("password must contain at least one number")
    .matches(/[a-z]/)
    .withMessage("password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("password must contain at least one capital letter"),
];
