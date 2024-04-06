'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { checkUserById } from '../../utils/index.js';

const header = 'route: register-category';
const msg = 'Register New Category Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const categoryController = controller.categoryController;

// API Function
const registerNewCategory = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);
    
    try {
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = categoryController.validateNewCategoryPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call external service - accounts svc to check if user exists');
            const isUserValid = await checkUserById(payload.userId, req);

            if (isUserValid.isValid) {
                log.info('Call controller function to check category already exists');
                const isCategoryFound = await categoryController.isCategoryByNameExists(payload);
    
                if (isCategoryFound.isValid) {
                    log.info('Call controller function to create new category in database');
                    const newCategoryDetails = await categoryController.registerNewCategory(payload);
    
                    if (newCategoryDetails.isValid) {
                        registerLog.createInfoLog('Successfully registered new category', null, updatedInfo);
                        res.status(responseCodes[newCategoryDetails.resType]).json(
                            buildApiResponse(newCategoryDetails)
                        );
                    } else {
                        log.error('Error while creating new category in db');
                        return next(newCategoryDetails);
                    }
                } else {
                    log.error('Error while checking for existing record');
                    return next(isCategoryFound);
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

export default registerNewCategory;
