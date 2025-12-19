const UserModel = require('../models/user.model');
const { successResponse, errorResponse, notFoundResponse, validationErrorResponse } = require('../utils/response');
const logger = require('../utils/logger');

exports.getMe = async (req, res, next) => {
  try {
    const users = await UserModel.getUsersAddress({ address: req.address });
    if (users.length === 0) {
      const { response, statusCode } = notFoundResponse('User not found');
      return res.status(statusCode).json(response);
    }

    const user = users[0];
    const { response, statusCode } = successResponse({
      id: user.id,
      address: user.address,
      token_balance: user.token_balance,
      MBUSD_balance: user.MBUSD_balance,
      referral_code: user.referral_code,
    });

    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get user error:', error);
    next(error);
  }
};

exports.updateMe = async (_req, res) => {
  const { response, statusCode } = errorResponse('Not implemented', 501);
  return res.status(statusCode).json(response);
};

exports.getSettings = async (req, res, next) => {
  try {
    let userId;

    // Check if request has authorization header and valid address
    const authHeader = req.headers['authorization'];
    const hasValidAuth = authHeader && req.address;

    logger.info('Settings GET request:', {
      hasAuthHeader: !!authHeader,
      hasAddress: !!req.address,
      hasValidAuth
    });

    // If authenticated, use authenticated user
    if (hasValidAuth) {
      const users = await UserModel.getUsersAddress({ address: req.address });
      if (users.length === 0) {
        const { response, statusCode } = notFoundResponse('User not found');
        return res.status(statusCode).json(response);
      }
      userId = users[0].id;
    } else {
      // For testing without auth, use default user ID (first user in mock data)
      userId = 2; // Default to user ID 2 from sample data
    }

    const settings = await UserModel.getUserSettings(userId);

    const { response, statusCode } = successResponse(settings);
    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get user settings error:', error);
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    let userId;

    // Check if request has authorization header and valid address
    const authHeader = req.headers['authorization'];
    const hasValidAuth = authHeader && req.address;

    // If authenticated, use authenticated user
    if (hasValidAuth) {
      const users = await UserModel.getUsersAddress({ address: req.address });
      if (users.length === 0) {
        const { response, statusCode } = notFoundResponse('User not found');
        return res.status(statusCode).json(response);
      }
      userId = users[0].id;
    } else {
      // For testing without auth, use default user ID (first user in mock data)
      userId = 2; // Default to user ID 2 from sample data
    }
    const {
      emailNotifications,
      pushNotifications,
      smsNotifications,
      twoFactorAuth,
      language,
      theme,
      currency,
    } = req.body;

    // Validate input
    const allowedFields = {
      emailNotifications,
      pushNotifications,
      smsNotifications,
      twoFactorAuth,
      language,
      theme,
      currency,
    };

    // Remove undefined fields
    Object.keys(allowedFields).forEach(key => {
      if (allowedFields[key] === undefined) {
        delete allowedFields[key];
      }
    });

    // Validate boolean fields
    const booleanFields = ['emailNotifications', 'pushNotifications', 'smsNotifications', 'twoFactorAuth'];
    for (const field of booleanFields) {
      if (allowedFields[field] !== undefined && typeof allowedFields[field] !== 'boolean') {
        const { response, statusCode } = validationErrorResponse(`${field} must be a boolean`);
        return res.status(statusCode).json(response);
      }
    }

    // Validate language
    if (allowedFields.language && !['en', 'es', 'fr', 'de', 'zh', 'ja'].includes(allowedFields.language)) {
      const { response, statusCode } = validationErrorResponse('Invalid language value');
      return res.status(statusCode).json(response);
    }

    // Validate theme
    if (allowedFields.theme && !['light', 'dark'].includes(allowedFields.theme)) {
      const { response, statusCode } = validationErrorResponse('Theme must be either light or dark');
      return res.status(statusCode).json(response);
    }

    // Validate currency
    if (allowedFields.currency && !['USD', 'EUR', 'GBP', 'JPY', 'CNY'].includes(allowedFields.currency)) {
      const { response, statusCode } = validationErrorResponse('Invalid currency value');
      return res.status(statusCode).json(response);
    }

    if (Object.keys(allowedFields).length === 0) {
      const { response, statusCode } = validationErrorResponse('At least one setting field is required');
      return res.status(statusCode).json(response);
    }

    const result = await UserModel.updateUserSettings(userId, allowedFields);

    const { response, statusCode } = successResponse(result.settings, 'Settings updated successfully');
    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Update user settings error:', error);
    next(error);
  }
};