'use strict';

import { validateNewCategoryPayload } from './validatePayload.controller.js';
import { isCategoryByNameExists, registerNewCategory } from './registerNewCategory.controller.js';

export default {
    validateNewCategoryPayload,
    isCategoryByNameExists,
    registerNewCategory
};
