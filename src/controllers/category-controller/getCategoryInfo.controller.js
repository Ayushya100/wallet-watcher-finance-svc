'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: get-category-infos';

const log = logger(header);
const registerLog = createNewLog(header);

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

export {
    getAllCategoryInfo
};
