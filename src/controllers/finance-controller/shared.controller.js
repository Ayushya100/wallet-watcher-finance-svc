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

const updateCardAmount = async(payload, type) => {
    registerLog.createDebugLog('Start updating card amount');

    try {
        log.info('Execution for updating card amount started');
        log.info('Call db query to get the current user finance details');
        let userFinance = await dbConnect.getUserFinanceById(payload.userId);
        userFinance = userFinance[0];
        if (type === 'INCOME') {
            userFinance.availableFunds = Number(userFinance.availableFunds) + Number(payload.amount);
            userFinance.lifeTimeIncome = Number(userFinance.lifeTimeIncome) + Number(payload.amount);
            payload.amount = Number(payload.cardBalance) + Number(payload.amount);
        } else if (type === 'INVESTMENT') {
            userFinance.availableFunds = Number(userFinance.availableFunds) - Number(payload.amount);
            userFinance.lifeTimeInvestment = Number(userFinance.lifeTimeInvestment) + Number(payload.amount);
            payload.amount = Number(payload.cardBalance) - Number(payload.amount);
        }

        log.info('Call db query to update card amount in database');
        const updateAmount = await dbConnect.updateCardAmount(payload.userId, payload.cardToken, payload.amount);
        log.info('Call db query to update user finance details');
        await dbConnect.updateUserFinance(payload.userId, userFinance);
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
