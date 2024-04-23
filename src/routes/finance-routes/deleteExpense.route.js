'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { checkUserById, checkCardByToken } from '../../utils/index.js';

const header = 'route: delete-expense';
const msg = 'Delete Expense Route started';

const log = logger(header);
const registerLog = createNewLog(header);
const financeController = controller.financeController;

// API Function
const deleteExpense = async(req, res, next) => {
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

        log.info(`Call controller function to check if expense record with provided id (${recordId}) exists`);
        const isRecordAvailable = await financeController.isExpenseRecordAvailable(userId, recordId);
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
        
        log.info('Call controller function to delete expense record');
        const expenseRecordDeleted = await financeController.deleteExpense(userId, recordId, isRecordAvailable.data, isCardAvailable.data);
        registerLog.createInfoLog('Successfully deleted expense records from db', null, expenseRecordDeleted);
        res.status(responseCodes[expenseRecordDeleted.resType]).json(
            buildApiResponse(expenseRecordDeleted)
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

export default deleteExpense;

