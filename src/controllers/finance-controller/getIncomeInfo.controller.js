'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import { buildProjectFields } from '../../utils/buildFilterFields.js';

const header = 'controller: get-income-info';

const log = logger(header);
const registerLog = createNewLog(header);

const getAllIncomeRecords = async(userId, filter) => {
    registerLog.createDebugLog('Start retrieving all income records');

    try {
        log.info('Execution for retrieving all income records started');
        const filterFields = buildProjectFields(filter, 'INCOME');

        log.info('Call db query to retrieve all income records');
        const incomeRecords = await dbConnect.getIncomeRecords(userId, null, filterFields);

        if (incomeRecords.length === 0) {
            log.info('No income record found');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: 'No income record found',
                isValid: true
            };
        }
        log.info('Execution for retrieving all income records completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'Income Records retrieved successfully',
            data: incomeRecords,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to retrieve income records');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const getIncomeInfoById = async(userId, recordId, filter) => {
    registerLog.createDebugLog('Start retrieving income record by id');

    try {
        log.info('Execution for retrieving income record by id started');
        const filterFields = buildProjectFields(filter, 'INCOME');

        log.info('Call db query to retrieve income records by id');
        const incomeRecords = await dbConnect.getIncomeRecords(userId, recordId, filterFields);
        
        if (incomeRecords.length === 0) {
            log.error('No income record found');
            return {
                resType: 'NOT_FOUND',
                resMsg: 'No income record found',
                isValid: false
            };
        }
        log.info('Execution for retrieving income records by id completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'Income Records retrieved successfully',
            data: incomeRecords,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to retrieve income by id');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllIncomeRecords,
    getIncomeInfoById
};
