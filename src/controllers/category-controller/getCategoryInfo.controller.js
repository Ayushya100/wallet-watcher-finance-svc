'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: get-category-infos';

const log = logger(header);
const registerLog = createNewLog(header);

const convertCategoryType = (categoryType) => {
    return categoryType.toUpperCase();
}

const getAllCategoryInfo = async(userId) => {
    registerLog.createDebugLog('Start retrieving all category informations for user');

    try {
        log.info('Execution for retrieving all category informations started');
        log.info(`Call db query to retrieve all category informations of the user : ${userId}`);
        const allCategoryInfo = await dbConnect.getAllCategoryInfo(userId);

        if (allCategoryInfo.length === 0) {
            log.info('No category information found in database');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: 'No category found',
                data: allCategoryInfo,
                isValid: true
            };
        }
        log.info('Execution for retrieving all category informations completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'Category details found.',
            data: allCategoryInfo,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to retrieve the category info for user');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const getCategoryInfoById = async(userId, categoryId) => {
    registerLog.createDebugLog('Start retrieving all category information by id');

    try {
        log.info('Execution for retrieving category informations for specific id started');
        log.info(`Call db query to retrieve category information of the user by category id : ${userId}`);
        const categoryInfo = await dbConnect.getCategoryInfoById(userId, categoryId);

        if (categoryInfo.length === 0) {
            log.error('No category information found in database');
            return {
                resType: 'NOT_FOUND',
                resMsg: 'No category details found',
                isValid: false
            };
        }
        log.info('Execution for retrieving category informations by id completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'Category details found.',
            data: categoryInfo,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to retrieve the category info by id');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const getCategoryInfoByType = async(userId, categoryType) => {
    registerLog.createDebugLog('Start retrieving all category information by type');

    try {
        log.info('Execution for retrieving category informations for specific type started');
        log.info(`Call db query to retrieve category information of the user by category type : ${userId}`);
        categoryType = convertCategoryType(categoryType);
        const categoryInfo = await dbConnect.getCategoryInfoByType(userId, categoryType);

        if (categoryInfo.length === 0) {
            log.info('No category information found in database');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: 'No category found',
                data: categoryInfo,
                isValid: true
            };
        }
        log.info('Execution for retrieving category informations by type completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'Category details found.',
            data: categoryInfo,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to retrieve the category info by type');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllCategoryInfo,
    getCategoryInfoById,
    getCategoryInfoByType
};
