'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import financeController from './index.js';
import { updateInvAccountAmount } from '../../db/finance.db.js';

const header = 'controller: delete-expense';

const log = logger(header);
const registerLog = createNewLog(header);

const isExpenseRecordAvailable = async(userId, recordId) => {
    registerLog.createDebugLog('Check if expense record available');

    try {
        log.info('Execution for checking availability of the expense record started');
        let financeInfo = await financeController.getExpenseInfoById(userId, recordId, null, 'EXPENSE');

        log.debug(financeInfo);
        if (financeInfo.isValid) {
            financeInfo = financeInfo.data[0];
            log.info('Execution for retrieving user expense record completed successfully');
            financeInfo.type = 'EXPENSE';
            return {
                resType: 'SUCCESS',
                resMsg: 'Successfully retrieved the requested expense record',
                data: financeInfo,
                isValid: true
            };
        }

        financeInfo = await financeController.getExpenseInfoById(userId, recordId, null, 'CREDIT-EXPENSE');
        if (financeInfo.isValid) {
            financeInfo = financeInfo.data[0];
            log.info('Execution for retrieving user expense record completed successfully');
            financeInfo.type = 'CREDIT-EXPENSE';
            return {
                resType: 'SUCCESS',
                resMsg: 'Successfully retrieved the requested expense record',
                data: financeInfo,
                isValid: true
            };
        }

        log.error('No such expense record exists in database');
        return financeInfo;
    } catch (err) {
        log.error('Error while working with db to check if expense records exists');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const deleteExpense = async(userId, recordId, recordDetails, cardDetails) => {
    registerLog.createDebugLog('Start deleting expense records');

    try {
        log.info('Execution for deleting expense record started');
        log.info('Call function to revert card balance and user finance details of user');
        const updatedCardInfo = await financeController.revertCardAmount({
            userId: userId,
            cardToken: recordDetails.cardToken,
            amount: recordDetails.amount,
            cardBalance: cardDetails.balance
        }, 'EXPENSE');

        log.info('Call db query to delete expense record');
        let expenseInfo;
        if (recordDetails.type === 'EXPENSE') {
            expenseInfo = await dbConnect.revertExpenseRecord(userId, recordId);
        } else if (recordDetails.type === 'CREDIT-EXPENSE') {
            expenseInfo = await dbConnect.revertCreditExpenseRecord(userId, recordId);
        }

        if (!expenseInfo) {
            log.error('Error while reverting expense record from DB');
            return {
                resType: 'INTERNAL_SERVER_ERROR',
                resMsg: 'Some error occurred while deleting the income record from db',
                isValid: false
            };
        }

        log.info('Finished execution for deleting expense record successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'Successfully deleted the requested expense record',
            data: expenseInfo,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to delete expense records');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isExpenseRecordAvailable,
    deleteExpense
};
