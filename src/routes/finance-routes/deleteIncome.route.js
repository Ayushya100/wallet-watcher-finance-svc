'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { checkUserById, checkCardByToken } from '../../utils/index.js';

const header = 'route: delete-income';
const msg = 'Delete Income Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const financeController = controller.financeController;

// API Function
const deleteIncome = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const recordId = req.params.id;
        const userId = req.body.userId;

        log.info('Call external service - accounts svc to check if user exists');
        const isUserValid = await checkUserById(userId, req);
        if (!isUserValid.isValid) {
            throw isUserValid;
        }

        log.info(`Call controller function to check if income record with provided id (${recordId}) exists`);
        const isRecordAvailable = await financeController.isIncomeRecordAvailable(userId, recordId);
        if (!isRecordAvailable.isValid) {
            throw isRecordAvailable;
        }

        log.info('Call external service - accounts svc to check if card exists');
        const isCardAvailable = await checkCardByToken(userId, isRecordAvailable.data.cardToken, req);
        if (!isCardAvailable.isValid) {
            throw {
                resType: 'NOT_FOUND',
                resMsg: 'Card doesnot exist any more, hence cannot revert the requested transaction.',
                isValid: false
            };
        }

        log.info('Call controller function to delete income record');
        const incomeRecordDeleted = await financeController.deleteIncome(userId, recordId, isRecordAvailable.data, isCardAvailable.data);
        registerLog.createInfoLog('Successfully deleted income records from db', null, incomeRecordDeleted);
        res.status(responseCodes[incomeRecordDeleted.resType]).json(
            buildApiResponse(incomeRecordDeleted)
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

export default deleteIncome;
