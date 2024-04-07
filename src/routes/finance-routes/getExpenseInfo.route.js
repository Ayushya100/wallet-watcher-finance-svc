'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { checkUserById } from '../../utils/index.js';

const header = 'route: get-expense-info';
const msg = 'Get Expense Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const financeController = controller.financeController;

// API Function
const getExpenseInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const recordId = req.params.id;
        const expenseType = req.params.type;
        const filter = req.query.filter;
        const userId = req.body.userId;

        log.info('Call external service - accounts svc to check if user exists');
        const isUserValid = await checkUserById(userId, req);
        if (!isUserValid.isValid) {
            throw isUserValid;
        }

        let expenseRecord;
        if (recordId) {
            log.info('Call controller function to retrieve income record by id');
            expenseRecord = await financeController.getExpenseInfoById(userId, recordId, filter, expenseType);
        } else {
            log.info('Call controller function to retrieve all income records');
            expenseRecord = await financeController.getAllExpenseInfo(userId, filter, expenseType);
        }

        if (!expenseRecord.isValid) {
            throw expenseRecord;
        }

        registerLog.createInfoLog('Successfully retrieved income records from db', null, expenseRecord);
        res.status(responseCodes[expenseRecord.resType]).json(
            buildApiResponse(expenseRecord)
        );
    } catch (err) {
        if (err.resType === 'INTERNAL_SERVER_ERROR') {
            log.error('Internal Error occurred while working with router functions');
        } else {
            log.error(`Error occurred : ${err.resMsg}`);
        }
        next(err);
    }
}

export default getExpenseInfo;
