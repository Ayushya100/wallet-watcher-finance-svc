'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { checkUserById } from '../../utils/index.js';

const header = 'route: get-category-by-id';
const msg = 'Get Category By Id Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const categoryController = controller.categoryController;

// API Function
const getCategoryInfoById = async(req, res, next) => {
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

        log.info('Call controller function to get category information by id');
        const categoryInfo = await categoryController.getCategoryInfoById(userId, categoryId);
        if (!categoryInfo.isValid) {
            throw categoryInfo;
        }
    
        registerLog.createInfoLog('Successfully retrieved category info by id', null, categoryInfo);
        res.status(responseCodes[categoryInfo.resType]).json(
            buildApiResponse(categoryInfo)
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

export default getCategoryInfoById;
