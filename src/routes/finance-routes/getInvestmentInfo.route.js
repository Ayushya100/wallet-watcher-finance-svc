'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { checkUserById } from '../../utils/index.js';

const header = 'route: get-investment-info';
const msg = 'Get Investment Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const financeController = controller.financeController;

// API Function
const getInvestmentInfo = async(req, res, next) => {
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

        let investmentRecord;
        if (recordId) {
            log.info('Call controller function to retrieve investment record by id');
            investmentRecord = await financeController.getInvestmentInfoById(userId, recordId, filter);
        } else {
            log.info('Call controller function to retrieve all investment records');
            investmentRecord = await financeController.getAllInvestmentRecords(userId, filter);
        }

        if (!investmentRecord.isValid) {
            throw investmentRecord;
        }

        registerLog.createInfoLog('Successfully retrieved investment records from db', null, investmentRecord);
        res.status(responseCodes[investmentRecord.resType]).json(
            buildApiResponse(investmentRecord)
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

export default getInvestmentInfo;
