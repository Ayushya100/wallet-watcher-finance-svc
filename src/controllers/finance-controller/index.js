'use strict';

import {
    validateNewIncomePayload,
    validateNewIinvestmentPayload
} from './validatePayload.controller.js';
import { getCategoryInfoByIdAndType, updateCardAmount } from './shared.controller.js';
import { registerIncome } from './registerIncome.controller.js';
import { registerInvestment } from './registerInvestment.controller.js';
import { registerExpense } from './registerExpense.controller.js';

export default {
    validateNewIncomePayload,
    validateNewIinvestmentPayload,
    getCategoryInfoByIdAndType,
    updateCardAmount,
    registerIncome,
    registerInvestment,
    registerExpense
};
