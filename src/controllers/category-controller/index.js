'use strict';

import {
    validateNewCategoryPayload,
    validateUserExistsPayload,
    validateGetCategoryByIdPayload
} from './validatePayload.controller.js';
import { isCategoryByNameExists, registerNewCategory } from './registerNewCategory.controller.js';
import {
    getAllCategoryInfo,
    getCategoryInfoById,
    getCategoryInfoByType
} from './getCategoryInfo.controller.js';

export default {
    validateNewCategoryPayload,
    validateUserExistsPayload,
    validateGetCategoryByIdPayload,
    isCategoryByNameExists,
    registerNewCategory,
    getAllCategoryInfo,
    getCategoryInfoById,
    getCategoryInfoByType
};
