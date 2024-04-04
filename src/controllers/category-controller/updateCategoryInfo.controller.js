'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: update-category-info';

const log = logger(header);
const registerLog = createNewLog(header);

const capitalizeFirstLetter = (categoryName) => {
    return categoryName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const updateCategoryInfo = async(categoryId, payload) => {
    registerLog.createDebugLog('Start updating category info');

    try {
        log.info('Execution for updating the category information started');
        payload.categoryName = capitalizeFirstLetter(payload.categoryName);

        log.info(`Call db query to update category information of the user : ${categoryId}`);
        const updatedCategoryInfo = await dbConnect.updateCategoryName(categoryId, payload);

        if (updatedCategoryInfo.length === 0) {
            log.info('No data is returned by the database server');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: 'No category found',
                data: updatedCategoryInfo,
                isValid: true
            };
        }

        log.info('Execution for updating category information completed successfully');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'Category info has been updated successfully.',
            data: updatedCategoryInfo,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to update the category info for user');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    updateCategoryInfo
};
