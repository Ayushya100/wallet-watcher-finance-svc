'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { checkUserById } from '../../utils/index.js';

const header = 'route: get-all-category-info';
const msg = 'Get All Category Info Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const categoryController = controller.categoryController;

// API Function
const getAllCategoryInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.body.userId;

        log.info('Call payload validator');
        const isValidPayload = categoryController.validateUserExistsPayload(userId);

        if (isValidPayload.isValid) {
            log.info('Call controller function to check if user exists');
            const isUserValid = await checkUserById(userId, req);

            if (isUserValid.isValid) {
                log.info('Call controller function to get all category info');
                const allCategoryInfo = await categoryController.getAllCategoryInfo(userId);
    
                if (allCategoryInfo.isValid) {
                    registerLog.createInfoLog('Successfully retrieved all category infos', null, allCategoryInfo);
                    res.status(responseCodes[allCategoryInfo.resType]).json(
                        buildApiResponse(allCategoryInfo)
                    );
                } else {
                    log.error('Error while retrieving all category informations');
                    return next(allCategoryInfo);
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

export default getAllCategoryInfo;
