'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import financeController from './index.js';

const header = 'controller: register-income';

const log = logger(header);
const registerLog = createNewLog(header);

const registerIncomeDetail = async(payload) => {
    try {
        log.info('Execution for registering income detail started');
        log.info('Call db query to register new income detail');
        const newIncomeInfo = await dbConnect.createNewIncomeRecord(payload);

        if (newIncomeInfo) {
            log.info('Execution completed to register new income detail record');
            return newIncomeInfo;
        }
        log.error('Failed to create new income record in db');
        return false;
    } catch (err) {
        log.error('Error while working with db to register new income record');
        return false;
    }
}

const registerIncome = async(payload) => {
    registerLog.createDebugLog('Start registering income');

    try {
        log.info('Execution for registering income started');
        const registeredIncomeDetail = await registerIncomeDetail(payload);

        if (registeredIncomeDetail) {
            const cardDetails = await financeController.updateCardAmount(payload, 'INCOME');
            
            if (cardDetails) {
                log.info('Execution completed for adding income record and updating card amount');
                return {
                    resType: 'REQUEST_COMPLETED',
                    resMsg: 'New income record has been registered successfully.',
                    data: registeredIncomeDetail,
                    isValid: true
                };
            } else {
                log.info('Revert the transaction as failed to update card amount');
                log.info('Call db query to revert the transaction');
                const incomeDetail = await dbConnect.deleteIncomeRecord(registeredIncomeDetail._id, registeredIncomeDetail.userId);
                
                log.info('Transaction revertion completed');
                return {
                    resType: 'BAD_REQUEST',
                    resMsg: 'Failed to register income in database',
                    isValid: false
                };
            }
        }

        log.error('Error while working with db to register new income record');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to register new income record',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to register income');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    registerIncome
};
