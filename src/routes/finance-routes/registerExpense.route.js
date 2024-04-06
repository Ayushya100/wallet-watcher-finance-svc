'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { checkUserById, checkCardByToken } from '../../utils/index.js';

const header = 'route: register-expense';
const msg = 'Register New Expense Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const financeController = controller.financeController;

// API Function
const registerExpense = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = financeController.validateNewIncomePayload(payload);
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info('Call external service - accounts svc to check if user exists');
        const isUserValid = await checkUserById(payload.userId, req);
        if (!isUserValid.isValid) {
            throw isUserValid;
        }

        log.info('Call external service - accounts svc to check if card exists');
        const isCardAvailable = await checkCardByToken(payload.userId, payload.cardToken, req);
        if (!isCardAvailable.isValid) {
            throw isCardAvailable;
        }
        if (!isCardAvailable.data.isActive) {
            throw {
                resType: 'BAD_REQUEST',
                resMsg: 'Card is not active to make a transaction',
                isValid: false
            };
        }

        log.info('Call controller function to check is category provided in the request exist or not');
        const isCategoryAvailable = await financeController.getCategoryInfoByIdAndType(payload.userId, payload.categoryId, 'EXPENSE');
        if (!isCategoryAvailable.isValid) {
            throw isCategoryAvailable;
        }
        payload.cardBalance = isCardAvailable.data.balance;
        payload.cardType = isCardAvailable.data.cardType;
        
        log.info('Call controller function to register new expense');
        const isExpenseRegistered = await financeController.registerExpense(payload);
        if (!isExpenseRegistered.isValid) {
            throw isExpenseRegistered;
        }

        // registerLog.createInfoLog('Successfully registered new income in db', null, isExpenseRegistered);
        res.status(responseCodes[isExpenseRegistered.resType]).json(
            buildApiResponse(isExpenseRegistered)
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

export default registerExpense;
