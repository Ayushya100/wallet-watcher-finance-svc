'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import financeController from './index.js';

const header = 'controller: register-investment';

const log = logger(header);
const registerLog = createNewLog(header);

const registerInvestmentDetail = async(payload) => {
    try {
        log.info('Execution for registering investment detail started');
        log.info('Call db query to register new investment detail');
        const newInvestmentInfo = await dbConnect.createNewInvestmentRecord(payload);

        if (newInvestmentInfo) {
            log.info('Execution completed to register new investment detail record');
            return newInvestmentInfo;
        }
        log.error('Failed to create new investment record in db');
        return false;
    } catch (err) {
        log.error('Error while working with db to register new investment record');
        return false;
    }
}

const registerInvestment = async(payload) => {
    registerLog.createDebugLog('Start registering investment');

    try {
        log.info('Execution for registering investment started');
        if (payload.amount > payload.cardBalance) {
            return {
                resType: 'BAD_REQUEST',
                resMsg: 'Insufficient Balance, cannot make the requested investment',
                isValid: false
            };
        }

        const registeredInvestmentDetail = await registerInvestmentDetail(payload);

        if (registeredInvestmentDetail) {
            const cardDetails = await financeController.updateCardAmount(payload, 'INVESTMENT');

            if (cardDetails) {
                return {
                    resType: 'REQUEST_COMPLETED',
                    resMsg: 'New category has been added successfully.',
                    data: registeredInvestmentDetail,
                    isValid: true
                };
            } else {
                log.info('Revert the transaction as failed to update card amount');
                log.info('Call db query to revert the transaction');
                const incomeDetail = await dbConnect.deleteInvestmentRecord(registeredInvestmentDetail._id, registeredInvestmentDetail.userId);
                
                log.info('Transaction revertion completed');
                return {
                    resType: 'BAD_REQUEST',
                    resMsg: 'Failed to register investment in database',
                    isValid: false
                };
            }
        }

        log.error('Error while working with db to register new investment record');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db to register new investment record',
            isValid: false
        };
    } catch(err) {
        log.error('Error while working with db to register investment');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    registerInvestment
};
