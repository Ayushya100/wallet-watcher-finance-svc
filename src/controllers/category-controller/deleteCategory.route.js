'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: delete-category';

const log = logger(header);
const registerLog = createNewLog(header);

const deleteCategory = async(userId, categoryId) => {
    registerLog.createDebugLog('Start deleting category info');

    try {
        log.info('Execution for deleting the category information started');
        log.info(`Call db query to delete category information of the user : ${userId}`);
        const deleteCategoryInfo = await dbConnect.deleteCategoryById(userId, categoryId);

        if (!deleteCategoryInfo) {
            log.error('Failed to delete the category information');
            return {
                resType: 'BAD_REQUEST',
                resMsg: 'Category Deletion Failed!',
                isValid: false
            };
        }

        log.info('Execution for deleting the category information completed successfully');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'Category info has been updated successfully.',
            data: deleteCategoryInfo,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to delete the category info for user');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        }; 
    }
}

export {
    deleteCategory
};
