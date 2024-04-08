'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import financeController from './index.js';
import { updateInvAccountAmount } from '../../db/finance.db.js';

const header = 'controller: delete-investment';

const log = logger(header);
const registerLog = createNewLog(header);

const isInvestmentRecordAvailable = async(userId, recordId) => {
    registerLog.createDebugLog('Check if investment record available');

    try {
        log.info('Execution for checking availability of the investment record started');
        let financeInfo = await financeController.getInvestmentInfoById(userId, recordId);

        if (financeInfo.data) {
            financeInfo = financeInfo.data[0];
            log.info('Execution for retrieving user investment record completed successfully');
            return {
                resType: 'SUCCESS',
                resMsg: 'Successfully retrieved the requested investment record',
                data: financeInfo,
                isValid: true
            };
        }

        log.error('No such investment record exists in database');
        return financeInfo;
    } catch (err) {
        log.error('Error while working with db to check if investment records exists');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const deleteInvestment = async(userId, recordId, recordDetails, cardDetails, accountDetails) => {
    registerLog.createDebugLog('Start deleting investment records');

    try {
        log.info('Executoin for deleting investment record started');

        if (recordDetails.amount > accountDetails.amount) {
            return {
                resType: 'BAD_REQUEST',
                resMsg: 'Account does not have enough amount to revert the requested transaction',
                isValid: false
            };
        }

        log.info('Call function to revert card balance and user finance details of user');
        const updatedCardInfo = await financeController.revertCardAmount({
            userId: userId,
            cardToken: recordDetails.cardToken,
            amount: recordDetails.amount,
            cardBalance: cardDetails.balance
        }, 'INVESTMENT');

        log.info('Call db query to delete investment record');
        const investmentInfo = await dbConnect.revertInvestmentRecord(userId, recordId);

        if (!investmentInfo) {
            log.error('Error while reverting investment record from DB');
            return {
                resType: 'INTERNAL_SERVER_ERROR',
                resMsg: 'Some error occurred while deleting the investment record from db',
                isValid: false
            };
        }

        const udpatedAccountAmt = Number(accountDetails.amount) - Number(recordDetails.amount);
        await updateInvAccountAmount(userId, recordDetails.investmentAccToken, udpatedAccountAmt);
        log.info('Finished execution for deleting investment record successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'Successfully deleted the requested investment record',
            data: investmentInfo,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to delete investment records');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isInvestmentRecordAvailable,
    deleteInvestment
};
