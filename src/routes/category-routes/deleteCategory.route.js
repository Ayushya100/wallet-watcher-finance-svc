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
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info('Call external service - accounts svc to check if user exists');
        const isUserValid = await checkUserById(userId, req);
        if (!isUserValid.isValid) {
            throw isUserValid;
        }

        log.info('Call controller function to check if category exists');
        const isCategoryAvailable = await categoryController.getCategoryInfoById(userId, categoryId);
        if (!isCategoryAvailable.isValid) {
            throw isCategoryAvailable;
        }

        log.info('Call controller function to delete the category');
        const updatedInfo = await categoryController.deleteCategory(userId, categoryId);
        if (!updatedInfo.isValid) {
            throw updatedInfo;
        }

        registerLog.createInfoLog('Successfully deleted category info', null, updatedInfo);
        res.status(responseCodes[updatedInfo.resType]).json(
            buildApiResponse(updatedInfo)
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

export default deleteCategory;
