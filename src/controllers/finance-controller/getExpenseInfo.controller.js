'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import { buildProjectFields } from '../../utils/buildFilterFields.js';

const header = 'controller: get-expense-info';

const log = logger(header);
const registerLog = createNewLog(header);

const getAllExpenseInfo = async(userId, filter, expenseType) => {
    registerLog.createDebugLog('Start retrieving all expense records');

    try {
        log.info('Execution for retrieving all expense records started');
        const filterFields = buildProjectFields(filter, 'EXPENSE');

        let expenseRecords;
        if (expenseType === 'EXPENSE') {
            log.info('Call db query to retrieve all expense records');
            expenseRecords = await dbConnect.getExpenseRecords(userId, null, filterFields);
        } else if (expenseType === 'CREDIT-EXPENSE') {
            log.info('Call db query to retrieve credit card expense records');
            expenseRecords = await dbConnect.getCreditExpenseRecords(userId, null, filterFields);
        } else {
            return {
                resType: 'BAD_REQUEST',
                resMsg: 'No Valid Expense Type Found',
                isValid: false
            };
        }

        if (expenseRecords.length === 0) {
            log.info('No expense record found');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: 'No expense record found',
                isValid: true
            };
        }
        log.info('Execution for retrieving all expense records completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'Expense Records retrieved successfully',
            data: expenseRecords,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to retrieve expense records');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const getExpenseInfoById = async(userId, recordId, filter, expenseType) => {
    registerLog.createDebugLog('Start retrieving expense record by id');

    try {
        log.info('Execution for retrieving expense record by id started');
        const filterFields = buildProjectFields(filter, 'EXPENSE');

        let expenseRecords;
        if (expenseType === 'EXPENSE') {
            log.info('Call db query to retrieve all expense records');
            expenseRecords = await dbConnect.getExpenseRecords(userId, recordId, filterFields);
        } else if (expenseType === 'CREDIT-EXPENSE') {
            log.info('Call db query to retrieve credit card expense records');
            expenseRecords = await dbConnect.getCreditExpenseRecords(userId, recordId, filterFields);
        } else {
            return {
                resType: 'BAD_REQUEST',
                resMsg: 'No Valid Expense Type Found',
                isValid: false
            };
        }

        if (expenseRecords.length === 0) {
            log.error('No expense record found');
            return {
                resType: 'NOT_FOUND',
                resMsg: 'No expense record found',
                isValid: false
            };
        }
        log.info('Execution for retrieving expense record by id completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'Expense Records retrieved successfully',
            data: expenseRecords,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to retrieve expense by id');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllExpenseInfo,
    getExpenseInfoById
};
