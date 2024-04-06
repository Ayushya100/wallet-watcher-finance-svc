'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { checkUserById, checkCardByToken } from '../../utils/index.js';

const header = 'route: register-income';
const msg = 'Register New Income Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const categoryController = controller.categoryController;
const financeController = controller.financeController;

// API Function
const registerIncome = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = financeController.validateNewIncomePayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call external service - accounts svc to check if user exists');
            const isUserValid = await checkUserById(payload.userId, req);

            if (isUserValid.isValid) {
                log.info('Call controller function to check is category provided in the request exist or not');
                const isCategoryAvailable = await financeController.getCategoryInfoByIdAndType(payload.userId, payload.categoryId, 'INCOME');

                if (isCategoryAvailable.isValid) {
                    log.info('Call external service - accounts svc to check if card exists');
                    const isCardAvailable = await checkCardByToken(payload.userId, payload.cardToken, req);

                    if (isCardAvailable.isValid) {
                        if (isCardAvailable.data.isActive) {
                            log.info('Call controller function to register new income');
                            const isIncomeRegistered = await financeController.registerIncome(payload, isCardAvailable.data);
    
                            if (isIncomeRegistered.isValid) {
                                registerLog.createInfoLog('Successfully registered new income in db', null, isIncomeRegistered);
                                res.status(responseCodes[isIncomeRegistered.resType]).json(
                                    buildApiResponse(isIncomeRegistered)
                                );
                            } else {
                                log.error('Error while registering the income in database');
                                return next(isIncomeRegistered);
                            }
                        } else {
                            log.error('Card is not active to make a transaction');
                            return next({
                                resType: 'BAD_REQUEST',
                                resMsg: 'Card is not active to make a transaction',
                                isValid: false
                            });
                        }
                    } else {
                        log.error('Error while checking for existing card');
                        return next(isCardAvailable);
                    }
                } else {
                    log.error('Error while checking for available category');
                    return next(isCategoryAvailable);
                }
            } else {
                log.error('Error while checking for existing user');
                return next(isUserValid);
            }
        } else {
            log.error('Error while validating the payload');
            return next(isValidPayload);
        }
    } catch (err) {
        log.error('Internal Error occurred while working with router functions');
        next({
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        });
    }
}

export default registerIncome;
