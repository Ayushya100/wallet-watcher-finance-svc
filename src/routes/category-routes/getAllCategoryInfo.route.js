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
        if (!isValidPayload.isValid) {
            throw isValidPayload;
        }

        log.info('Call external service - accounts svc to check if user exists');
        const isUserValid = await checkUserById(userId, req);
        if (!isUserValid.isValid) {
            throw isUserValid;
        }

        log.info('Call controller function to get all category info');
        const allCategoryInfo = await categoryController.getAllCategoryInfo(userId);
        if (!allCategoryInfo.isValid) {
            throw allCategoryInfo;
        }

        registerLog.createInfoLog('Successfully retrieved all category informations', null, allCategoryInfo);
        res.status(responseCodes[allCategoryInfo.resType]).json(
            buildApiResponse(allCategoryInfo)
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

export default getAllCategoryInfo;
