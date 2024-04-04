'use strict';

import {
    validateNewCategoryPayload,
    validateUserExistsPayload,
    validateGetCategoryByIdPayload,
    validateUpdateCategoryPayload
} from './validatePayload.controller.js';
import { isCategoryByNameExists, registerNewCategory } from './registerNewCategory.controller.js';
import {
    getAllCategoryInfo,
    getCategoryInfoById,
    getCategoryInfoByType
} from './getCategoryInfo.controller.js';
import { updateCategoryInfo } from './updateCategoryInfo.controller.js';

export default {
    validateNewCategoryPayload,
    validateUserExistsPayload,
    validateGetCategoryByIdPayload,
    validateUpdateCategoryPayload,
    isCategoryByNameExists,
    registerNewCategory,
    getAllCategoryInfo,
    getCategoryInfoById,
    getCategoryInfoByType,
    updateCategoryInfo
};
