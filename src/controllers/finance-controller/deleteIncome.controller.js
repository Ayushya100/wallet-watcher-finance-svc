'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import financeController from './index.js';

const header = 'controller: delete-income';

const log = logger(header);
const registerLog = createNewLog(header);

const isIncomeRecordAvailable = async(userId, recordId) => {
    registerLog.createDebugLog('Check if income record available');

    try {
        log.info('Execution for checking availability of the income record started');
        let financeInfo = await financeController.getIncomeInfoById(userId, recordId);

        if (financeInfo.data) {
            financeInfo = financeInfo.data[0];
            log.info('Execution for retrieving user income record completed successfully');
            return {
                resType: 'SUCCESS',
                resMsg: 'Successfully retrieved the requested income record',
                data: financeInfo,
                isValid: true
            };
        }

        log.error('No such income record exists in database');
        return financeInfo;
    } catch (err) {
        log.error('Error while working with db to check if income records exists');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const deleteIncome = async(userId, recordId, recordDetails, cardDetails) => {
    registerLog.createDebugLog('Start deleting income records');

    try {
        log.info('Execution for deleting income record started');

        if (recordDetails.amount > cardDetails.balance) {
            return {
                resType: 'BAD_REQUEST',
                resMsg: 'Amount already utilized! Cannot revert the requested transaction',
                isValid: false
            };
        }

        log.info('Call function to revert card balance and user finance details of user');
        const updatedCardInfo = await financeController.revertCardAmount({
            userId: userId,
            cardToken: recordDetails.cardToken,
            amount: recordDetails.amount,
            cardBalance: cardDetails.balance
        }, 'INCOME');

        log.info('Call db query to delete income record');
        const incomeInfo = await dbConnect.revertIncomeRecord(userId, recordId);

        if (!incomeInfo) {
            log.error('Error while reverting income record from DB');
            return {
                resType: 'INTERNAL_SERVER_ERROR',
                resMsg: 'Some error occurred while deleting the income record from db',
                isValid: false
            };
        }

        log.info('Finished execution for deleting income record successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'Successfully deleted the requested income record',
            data: incomeInfo,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to delete income records');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isIncomeRecordAvailable,
    deleteIncome
};
