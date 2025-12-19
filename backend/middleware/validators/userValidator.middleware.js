const { body, check } = require('express-validator');

exports.registerUserSchema = [
    check('email')
        .not().isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid email'),
    check('password')
        .not().isEmpty()
        .withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters'),
    check('confirm_password')
        .not().isEmpty()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Password and confirm password does not match'),
    // check('bnb_address')
    //     .not().isEmpty()
    //     .withMessage('Please connect metamask wallet')
];

exports.contactRequestSchema = [
    check('name')
        .not().isEmpty()
        .withMessage('Name is required'),
    check('email')
        .not().isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid email'),
    check('phone')
        .not().isEmpty()
        .withMessage('Phone is required'),
    check('subject')
        .not().isEmpty()
        .withMessage('Subject is required'),
    check('message')
        .not().isEmpty()
        .withMessage('Message is required'),
];

exports.newsLetterSchema = [
    check('email')
        .not().isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid email')
];

exports.loginUserSchema = [
    check('email')
        .not().isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid email'),
    check('password')
        .not().isEmpty()
        .withMessage('Password is required')
];

exports.LoginWithAddressSchema = [
    check('address')
        .not().isEmpty()
        .withMessage('Address is required')
];

exports.ForgotPasswordSchema = [
    check('email')
        .not().isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid email')
];

exports.ResetPasswordSchema = [
    check('password')
        .not().isEmpty()
        .withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters'),
    check('confirm_password')
        .not().isEmpty()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Password and confirm password does not match')
];

exports.updatePasswordSchema = [
    check('old_password')
        .not().isEmpty()
        .withMessage('Old password is required'),
    check('password')
        .not().isEmpty()
        .withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters'),
    check('confirm_password')
        .not().isEmpty()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Password and confirm password does not match')
];

exports.updateSettingsSchema = [
    body('emailNotifications')
        .optional()
        .isBoolean()
        .withMessage('emailNotifications must be a boolean'),
    body('pushNotifications')
        .optional()
        .isBoolean()
        .withMessage('pushNotifications must be a boolean'),
    body('smsNotifications')
        .optional()
        .isBoolean()
        .withMessage('smsNotifications must be a boolean'),
    body('twoFactorAuth')
        .optional()
        .isBoolean()
        .withMessage('twoFactorAuth must be a boolean'),
    body('language')
        .optional()
        .isIn(['en', 'es', 'fr', 'de', 'zh', 'ja'])
        .withMessage('language must be one of: en, es, fr, de, zh, ja'),
    body('theme')
        .optional()
        .isIn(['light', 'dark'])
        .withMessage('theme must be either light or dark'),
    body('currency')
        .optional()
        .isIn(['USD', 'EUR', 'GBP', 'JPY', 'CNY'])
        .withMessage('currency must be one of: USD, EUR, GBP, JPY, CNY')
];