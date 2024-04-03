'use strict';

import { logger } from 'lib-common-service';

const log = logger('controller: validate-payload');

const returnValidationConfirmation = () => {
    log.info('Payload verification completed');
}

const isValidCategoryType = (categoryType) => {
    return ['EXPENSE', 'CREDIT-EXPENSE', 'INVESTMENT', 'INCOME'].includes(categoryType.toUpperCase());
}

const validateNewCategoryPayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    if (!payload.userId) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'User Id is missing';
        response.isValid = false;
    }

    if (!payload.categoryType) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Category Type is missing';
        response.isValid = false;
    }

    if (!payload.categoryName) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Category Name is missing';
        response.isValid = false;
    }

    if (payload.categoryType && !isValidCategoryType(payload.categoryType)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Category Type is invalid';
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

const validateUserExistsPayload = (userId) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    if (!userId) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'User Id is missing';
        response.isValid = false;
    }
    returnValidationConfirmation();
    return response;
}

const validateGetCategoryByIdPayload = (userId, categoryType) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    if (!userId) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'User Id is missing';
        response.isValid = false;
    }
    if (!isValidCategoryType(categoryType)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Category Type is invalid';
        response.isValid = false;
    }
    returnValidationConfirmation();
    return response;
}

export {
    validateNewCategoryPayload,
    validateUserExistsPayload,
    validateGetCategoryByIdPayload
};
