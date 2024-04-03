'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { checkUserById } from '../../utils/index.js';

const header = 'route: get-category-by-type';
const msg = 'Get Category By Type Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const categoryController = controller.categoryController;

// API Function
const getCategoryByType = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const categoryType = req.params.type;
        const userId = req.body.userId;

        log.info('Call payload validator');
        const isValidPayload = categoryController.validateGetCategoryByIdPayload(userId, categoryType);
        
        if (isValidPayload.isValid) {
            log.info('Call external service - accounts svc to check if user exists');
            const isUserValid = await checkUserById(userId, req);

            if (isUserValid.isValid) {
                log.info('Call controller function to get category information by type');
                const categoryInfo = await categoryController.getCategoryInfoByType(userId, categoryType);
    
                if (categoryInfo.isValid) {
                    registerLog.createInfoLog('Successfully retrieved category info by type', null, categoryInfo);
                    res.status(responseCodes[categoryInfo.resType]).json(
                        buildApiResponse(categoryInfo)
                    );
                } else {
                    log.error('Error while retrieving category info by type');
                    return next(categoryInfo);
                }
            } else {
                log.error('Error while checking for existing user');
                return next(isUserValid);
            }
        } else {
            log.error('Error while validating the payload');
            return next(isValidPayload);
        }
    } catch(err) {
        log.error('Internal Error occurred while working with router functions');
        next({
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        });
    }
}

export default getCategoryByType;
