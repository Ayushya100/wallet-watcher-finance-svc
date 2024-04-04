'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { checkUserById } from '../../utils/index.js';

const header = 'route: delete-category';
const msg = 'Delete Category Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const categoryController = controller.categoryController;

// API Function
const deleteCategory = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const categoryId = req.params.id;
        const userId = req.body.userId;

        log.info('Call payload validator');
        const isValidPayload = categoryController.validateUserExistsPayload(userId);

        if (isValidPayload.isValid) {
            log.info('Call external service - accounts svc to check if user exists');
            const isUserValid = await checkUserById(userId, req);

            if (isUserValid.isValid) {
                log.info('Call controller function to check if category exists');
                const isCategoryAvailable = await categoryController.getCategoryInfoById(userId, categoryId);

                if (isCategoryAvailable.isValid) {
                    log.info('Call controller function to delete the category');
                    const updatedInfo = await categoryController.deleteCategory(userId, categoryId);

                    if (updatedInfo.isValid) {
                        registerLog.createInfoLog('Successfully deleted category info', null, updatedInfo);
                        res.status(responseCodes[updatedInfo.resType]).json(
                            buildApiResponse(updatedInfo)
                        );
                    } else {
                        log.error('Error while deleting category');
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

export default deleteCategory;
