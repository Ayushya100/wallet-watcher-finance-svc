'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: register-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const convertCategoryType = (categoryType) => {
    return categoryType.toUpperCase();
}

const capitalizeFirstLetter = (categoryName) => {
    return categoryName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const isCategoryByNameExists = async(payload) => {
    registerLog.createDebugLog('Start checking if category provided by name already exists');

    try {
        log.info('Execution for checking if category provided by name already exists has started');
        payload.categoryType = convertCategoryType(payload.categoryType);
        payload.categoryName = capitalizeFirstLetter(payload.categoryName);

        log.info('Call db query to check if category by name already exists');
        const categoryDetails = await dbConnect.isCategoryByNameAvailable(payload);

        if (!categoryDetails) {
            log.info('Execution for checking category by name completed');
            return {
                resType: 'SUCCESS',
                resMsg: 'VALIDATION SUCCESSFULL - Category does not exists!',
                isValid: true
            };
        }

        log.error('Record already exist  in the database with this category name');
        return {
            resType: 'CONFLICT',
            resMsg: 'Category already exists',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to check if category for provided name already exists!');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const registerNewCategory = async(payload) => {
    registerLog.createDebugLog('Start creating new category');

    try {
        log.info('Execution for creating new category started');
        payload.categoryType = convertCategoryType(payload.categoryType);
        payload.categoryName = capitalizeFirstLetter(payload.categoryName);

        log.info('Call db query to register new category');
        const newCategory = await dbConnect.createNewCategory(payload);

        if (newCategory) {
            log.info('Execution for registering new category completed');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: 'New category has been added successfully.',
                data: newCategory,
                isValid: true
            };
        }
        log.error('Error while calling the db query to create new category');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Category registration failed!',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to create new category!');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isCategoryByNameExists,
    registerNewCategory
};
