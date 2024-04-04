'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { checkUserById } from '../../utils/index.js';

const header = 'route: update-category-info';
const msg = 'Update Category Info Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const categoryController = controller.categoryController;

// API Function
const updateCategoryInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const categoryId = req.params.id;
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = categoryController.validateUpdateCategoryPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call external service - accounts svc to check if user exists');
            const isUserValid = await checkUserById(payload.userId, req);

            if (isUserValid.isValid) {
                log.info('Call controller function to check if category exists');
                const isCategoryAvailable = await categoryController.getCategoryInfoById(payload.userId, categoryId);

                if (isCategoryAvailable.isValid) {
                    log.info('Call controller function to update the category info');
                    const updatedInfo = await categoryController.updateCategoryInfo(categoryId, payload);

                    if (updatedInfo.isValid) {
                        res.status(responseCodes[updatedInfo.resType]).json(
                            buildApiResponse(updatedInfo)
                        );
                    } else {
                        log.error('Error while updating category info');
                        return next(updatedInfo);
                    }
                } else {
                    log.error('Error while checking the availability of the category');
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

export default updateCategoryInfo;
