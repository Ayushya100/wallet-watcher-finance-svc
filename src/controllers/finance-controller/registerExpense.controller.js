'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import financeController from './index.js';

const header = 'controller: register-expense';

const log = logger(header);
const registerLog = createNewLog(header);

const registerExpenseDetail = async(payload) => {
    try {
        log.info('Execution for registering expense detail started');
        let newExpenseInfo = null;

        if (payload.cardType === 'CREDIT') {
            log.info('Call db query to register new credit card expense detail');
            newExpenseInfo = await dbConnect.createNewCrdExpenseRecord(payload);
        } else {
            log.info('Call db query to register new expense detail');
            newExpenseInfo = await dbConnect.createNewExpenseRecord(payload);
        }
        
        if (newExpenseInfo) {
            log.info('Execution completed to register new expense detail record');
            return newExpenseInfo;
        }
        log.error('Failed to create new expense record in db');
        return false;
    } catch (err) {
        log.error('Error while working with db to register new expense record');
        return false;
    }
}

const revertExpenseRecord = async(expenseRecord, cardType) => {
    try {
        let expenseDetail = null;

        if (cardType === 'CREDIT') {
            log.info('Call db query to revert the credit card expense');
            expenseDetail = await dbConnect.deleteCrdExpenseRecord(expenseRecord._id, expenseRecord.userId);
        } else {
            log.info('Call db query to revert the expense record');
            expenseDetail = await dbConnect.deleteExpenseRecord(expenseRecord._id, expenseRecord.userId);
        }
        return expenseDetail;
    } catch (err) {
        log.error('Error while working with db to revert expense record created');
        return false;
    }
}

const registerExpense = async(payload) => {
    registerLog.createDebugLog('Start registering expense');

    try {
        log.info('Execution for registering expense started');
        if (payload.amount > payload.cardBalance) {
            return {
                resType: 'BAD_REQUEST',
                resMsg: 'Insufficient Balance, cannot make the requested expense',
                isValid: false
            };
        }

        const registeredExpenseDetail = await registerExpenseDetail(payload);

        if (registeredExpenseDetail) {
            const cardDetails = await financeController.updateCardAmount(payload, 'EXPENSE');

            if (cardDetails) {
                return {
                    resType: 'REQUEST_COMPLETED',
                    resMsg: 'New Expense record has been registered successfully.',
                    data: registeredExpenseDetail,
                    isValid: true
                };
            } else {
                log.info('Revert the transaction as failed to update card amount');
                const expenseDetail = revertExpenseRecord(registerExpenseDetail, payload.cardType);

                log.info('Transaction revertion completed');
                return {
                    resType: 'BAD_REQUEST',
                    resMsg: 'Failed to register expense in database',
                    isValid: false
                };
            }
        }

        log.error('Error while working with db to register new expense record');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to register new expense record',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to register expense');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    registerExpense
};
