'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import {
    checkUserById,
    checkCardByToken,
    checkInvAccountByToken
} from '../../utils/index.js';

const header = 'route: register-expense';
const msg = 'Register New Expense Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const financeController = controller.financeController;

// API Function
const registerInvestment = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);
    
    try {
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = financeController.validateNewIinvestmentPayload(payload);
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

        log.info('Call external service - accounts svc to check if account exists');
        const isAccountAvailable = await checkInvAccountByToken(payload.userId, payload.investmentAccToken, req);
        if (!isAccountAvailable.isValid) {
            throw isAccountAvailable;
        }
        if (!isAccountAvailable.data.isActive) {
            throw {
                resType: 'BAD_REQUEST',
                resMsg: 'Account is not active to accept an investment',
                isValid: false
            };
        }

        log.info('Call controller function to check if category provided in the request exist or not');
        const isCategoryAvailable = await financeController.getCategoryInfoByIdAndType(payload.userId, payload.categoryId, 'INVESTMENT');
        if (!isCategoryAvailable.isValid) {
            throw isCategoryAvailable;
        }
        payload.cardBalance = isCardAvailable.data.balance;
        payload.accountAmount = isAccountAvailable.data.amount;
        
        log.info('Call controller function to register new investment');
        const isInvestmentRegistered = await financeController.registerInvestment(payload);
        if (!isInvestmentRegistered) {
            throw isInvestmentRegistered;
        }

        registerLog.createInfoLog('Successfully registered new investment in db', null, isInvestmentRegistered);
        res.status(responseCodes[isInvestmentRegistered.resType]).json(
            buildApiResponse(isInvestmentRegistered)
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

export default registerInvestment;
