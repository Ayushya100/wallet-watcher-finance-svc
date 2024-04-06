'use strict';

import { logger } from 'lib-common-service';
import axios from 'axios';

const header = 'util: request-external-svc';

const log = logger(header);

let externalSvcConfig = {};

const initializeSvc = (svc, port) => {
    log.info('External service config started');
    const host = process.env.NODE_ENV == 'dev' ? `http://localhost:${port}/${svc}` : '';
    externalSvcConfig.host = host;
    externalSvcConfig.version = 'v1.0';
    log.info('External service config completed');
}

const sendRequest = async(svcUrl, method, payload = null, accessToken = null, jsonData = null) => {
    log.info('Execution of external service request started');

    try {
        let baseUrl = `${externalSvcConfig.host}/api/${externalSvcConfig.version}/${svcUrl}`;
        let options = {
            method: method,
            url: baseUrl,
            baseUrl: baseUrl,
            timeout: 20000,
            headers: { accept: 'application/json, text/plain, */*', 'content-type': 'application/json' },
            responseType: 'json'
        };

        if (payload) {
            options.data = payload;
        }

        if (accessToken) {
            options.headers = { ...options.headers, Authorization: 'Bearer ' + accessToken };
        }
        
        let response;
        await axios(options).then(res => {
            response = {
                statusCode: res.data.statusCode,
                message: res.data.message,
                data: res.data.data,
                isValid: res.data.success
            };
        }).catch(err => {
            response = {
                statusCode: err.response.data.statusCode,
                resType: err.response.data.type,
                resMsg: err.response.data.errors,
                isValid: false
            };
        });
        log.info('Execution of external service request is successfully finished');
        return response;
    } catch (err) {
        log.error('Internal Error occurred while calling the external service');
        next({
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        });
    }
}

const checkUserById = async(userId, req) => {
    initializeSvc('accounts-svc', '3200');
    const url = `users/get-user-info/${userId}`;
    const accessToken = req.cookies?.accessToken;
    const response = await sendRequest(url, 'GET', null, accessToken);
    
    if (response.statusCode === 401) {
        response.resMsg = 'Unauthorized Access - Provided user doesnot exist';
    }
    return response;
}

const checkCardByToken = async(userId, cardToken, req) => {
    initializeSvc('accounts-svc', '3200');
    const url = `users/${userId}/get-card-info/${cardToken}`;
    const accessToken = req.cookies?.accessToken;
    return await sendRequest(url, 'GET', null, accessToken);
}

export {
    checkUserById,
    checkCardByToken
};
