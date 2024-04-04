'use strict';

import registerNewCategory from './registerNewCategory.route.js';
import getAllCategoryInfo from './getAllCategoryInfo.route.js';
import getCategoryInfoById from './getCategoryInfoById.route.js';
import getCategoryByType from './getCategoryByType.route.js';
import updateCategoryInfo from './updateCategoryInfo.route.js';
import deleteCategory from './deleteCategory.route.js';

export default {
    registerNewCategory,
    getAllCategoryInfo,
    getCategoryInfoById,
    getCategoryByType,
    updateCategoryInfo,
    deleteCategory
};
