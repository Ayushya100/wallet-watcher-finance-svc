'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import { buildProjectFields } from '../../utils/buildFilterFields.js';

const header = 'controller: get-investment-info';

const log = logger(header);
const registerLog = createNewLog(header);

const getAllInvestmentRecords = async(userId, filter) => {
    registerLog.createDebugLog('Start retrieving all investment records');

    try {
        log.info('Execution for retrieving all investment records started');
        const filterFields = buildProjectFields(filter, 'INVESTMENT');

        log.info('Call db query to retrieve all investment records');
        const investmentRecords = await dbConnect.getInvestmentRecords(userId, null, filterFields);

        if (investmentRecords.length === 0) {
            log.info('No investment record found');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: 'No investment record found',
                isValid: true
            };
        }
        log.info('Execution for retrieving all investment records completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'Investment Records retrieved successfully',
            data: investmentRecords,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to retrieve investment records');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const getInvestmentInfoById = async(userId, recordId, filter) => {
    registerLog.createDebugLog('Start retrieving investment record by id');

    try {
        log.info('Execution for retrieving investment record by id started');
        const filterFields = buildProjectFields(filter, 'INVESTMENT');

        log.info('Call db query to retrieve investment records by id');
        const investmentRecords = await dbConnect.getInvestmentRecords(userId, recordId, filterFields);
        
        if (investmentRecords.length === 0) {
            log.error('No investment record found');
            return {
                resType: 'NOT_FOUND',
                resMsg: 'No investment record found',
                isValid: false
            };
        }
        log.info('Execution for retrieving investment record by id completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'Investment Records retrieved successfully',
            data: investmentRecords,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to retrieve investment record by id');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllInvestmentRecords,
    getInvestmentInfoById
};
