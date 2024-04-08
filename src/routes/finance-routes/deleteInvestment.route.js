'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { checkUserById, checkCardByToken, checkInvAccountByToken } from '../../utils/index.js';

const header = 'route: delete-investment';
const msg = 'Delete Investment Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const financeController = controller.financeController;

// API Function
const deleteInvestment = async(req, res, next) => {
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

        log.info(`Call controller function to check if investment record with provided id (${recordId}) exists`);
        const isRecordAvailable = await financeController.isInvestmentRecordAvailable(userId, recordId);
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

        log.info('Call external service - accounts svc to check if account exists');
        const isAccountAvailable = await checkInvAccountByToken(userId, isRecordAvailable.data.investmentAccToken, req);
        if (!isAccountAvailable.isValid) {
            throw {
                resType: 'NOT_FOUND',
                resMsg: 'Account doesnot exist any more, hence cannot revert the requested transaction.',
                isValid: false
            };
        }

        log.info('Call controller function to delete investment record');
        const investmentRecordDeleted = await financeController.deleteInvestment(userId, recordId, isRecordAvailable.data, isCardAvailable.data, isAccountAvailable.data);
        // registerLog.createInfoLog('Successfully deleted income records from db', null, incomeRecordDeleted);
        res.status(responseCodes[investmentRecordDeleted.resType]).json(
            buildApiResponse(investmentRecordDeleted)
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

export default deleteInvestment;
