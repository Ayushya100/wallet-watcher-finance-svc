'use strict';

import { logger } from 'lib-common-service';

const log = logger('controller: validate-payload');

const returnValidationConfirmation = () => {
    log.info('Payload verification completed');
}

const validateProvidedDate = (enteredDate) => {
    enteredDate = new Date(enteredDate);
    const currentDate = new Date();
    return enteredDate <= currentDate;
}

const validateNewIncomePayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    const mandatoryFilds = ['userId', 'categoryId', 'cardToken', 'amount', 'detail', 'transactionDate'];

    if (!payload.userId || !payload.categoryId || !payload.cardToken || !payload.amount || !payload.detail || !payload.transactionDate) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Required parameter is missing';
        response.isValid = false;

        for (const field of mandatoryFilds) {
            if (!payload[field]) {
                response.resMsg += `: ${field}`;
                break;
            }
        }
    }

    if (payload.transactionDate && !validateProvidedDate(payload.transactionDate)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Credit date cannot be future date!';
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

export {
    validateNewIncomePayload
};
