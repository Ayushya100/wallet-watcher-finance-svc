'use strict';

import { logger } from 'lib-common-service';

const header = 'util: build-filter-fields';

const log = logger(header);

const allFields = (type) => {
    if (type === 'INCOME') {
        return {
            userId: 1,
            categoryId: 1,
            cardToken: 1,
            amount: 1,
            detail: 1,
            transactionDate: 1,
            createdOn: 1,
            modifiedOn: 1,
            cardNumber: 1,
            categoryName: 1
        };
    } else if (type === 'INVESTMENT') {
        return {
            userId: 1,
            categoryId: 1,
            investmentAccToken: 1,
            cardToken: 1,
            amount: 1,
            detail: 1,
            transactionDate: 1,
            createdOn: 1,
            modifiedOn: 1,
            cardNumber: 1,
            categoryName: 1,
            accountNumber: 1
        };
    } else if (type === 'EXPENSE') {
        return {
            userId: 1,
            categoryId: 1,
            cardToken: 1,
            amount: 1,
            detail: 1,
            transactionDate: 1,
            createdOn: 1,
            modifiedOn: 1,
            cardNumber: 1,
            categoryName: 1
        };
    }
}

const buildProjectFields = (filter, type) => {
    log.info('Building requested filter fields started');

    if (!filter) {
        return allFields(type);
    }
    
    const filterValues = JSON.parse(filter);

    if (filterValues.fields === 'all') {
        return allFields(type);
    }
    const fieldsToShow = {};
    filterValues.fields.map(field => fieldsToShow[field] = 1);
    return fieldsToShow;
}

export {
    buildProjectFields
};
