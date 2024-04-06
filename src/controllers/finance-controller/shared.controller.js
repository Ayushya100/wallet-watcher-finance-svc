'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: shared-finance-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const getCategoryInfoByIdAndType = async(userId, categoryId, categoryType) => {
    registerLog.createDebugLog('Start checking category information by id and type');

    try {
        log.info('Execution for retrieving the category information started');
        log.info('Call db query to retrieve the category information from database');
        const categoryInfo = await dbConnect.getCategoryInfoByIdAndType(userId, categoryId, categoryType);

        if (categoryInfo.length === 0) {
            log.info('No category information found in database');
            return {
                resType: 'NOT_FOUND',
                resMsg: 'No category info found',
                data: categoryInfo,
                isValid: false
            };
        }
        log.info('Execution for retrieving category information completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'Category details found.',
            data: categoryInfo,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to check the category info by id and type');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const updateCardAmount = async(payload, cardData, type) => {
    registerLog.createDebugLog('Start updating card amount');

    try {
        log.info('Execution for updating card amount started');
        if (type === 'INCOME') {
            payload.amount = Number(cardData.balance) + Number(payload.amount);
        }

        log.info('Call db query to update card amount in database');
        const updateAmount = await dbConnect.updateCardAmount(payload.userId, payload.cardToken, payload.amount);
        if (updateAmount) {
            log.info('Execution for updating card amount completed successfully');
            return true;
        }
        log.error('Error while updating the card amount in database');
        return false;
    } catch (err) {
        log.error('Error while working with db to update card amount');
        return false;
    }
}

export {
    getCategoryInfoByIdAndType,
    updateCardAmount
};
