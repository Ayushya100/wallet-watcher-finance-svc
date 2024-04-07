'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { checkUserById } from '../../utils/index.js';

const header = 'route: get-income-info';
const msg = 'Get Income Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const financeController = controller.financeController;

// API Function
const getIncomeInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const recordId = req.params.id;
        const filter = req.query.filter;
        const userId = req.body.userId;

        log.info('Call external service - accounts svc to check if user exists');
        const isUserValid = await checkUserById(userId, req);
        if (!isUserValid.isValid) {
            throw isUserValid;
        }

        let incomeRecord;
        if (recordId) {
            log.info('Call controller function to retrieve income record by id');
            incomeRecord = await financeController.getIncomeInfoById(userId, recordId, filter);
        } else {
            log.info('Call controller function to retrieve all income records');
            incomeRecord = await financeController.getAllIncomeRecords(userId, filter);
        }

        if (!incomeRecord.isValid) {
            throw incomeRecord;
        }

        registerLog.createInfoLog('Successfully retrieved income records from db', null, incomeRecord);
        res.status(responseCodes[incomeRecord.resType]).json(
            buildApiResponse(incomeRecord)
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

export default getIncomeInfo;
