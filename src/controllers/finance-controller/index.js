'use strict';

import { validateNewIncomePayload } from './validatePayload.controller.js';
import { getCategoryInfoByIdAndType, updateCardAmount } from './shared.controller.js';
import { registerIncome } from './registerIncome.controller.js';

export default {
    validateNewIncomePayload,
    getCategoryInfoByIdAndType,
    updateCardAmount,
    registerIncome
};
