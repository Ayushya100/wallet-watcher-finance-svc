'use strict';

import {
    validateNewIncomePayload,
    validateNewIinvestmentPayload
} from './validatePayload.controller.js';
import {
    getCategoryInfoByIdAndType,
    updateCardAmount,
    revertCardAmount
} from './shared.controller.js';
import { registerIncome } from './registerIncome.controller.js';
import { registerInvestment } from './registerInvestment.controller.js';
import { registerExpense } from './registerExpense.controller.js';
import { getAllIncomeRecords, getIncomeInfoById } from './getIncomeInfo.controller.js';
import { getAllInvestmentRecords, getInvestmentInfoById } from './getInvestmentInfo.controller.js';
import { getAllExpenseInfo, getExpenseInfoById } from './getExpenseInfo.controller.js';
import { isIncomeRecordAvailable, deleteIncome } from './deleteIncome.controller.js';
import { isInvestmentRecordAvailable, deleteInvestment } from './deleteInvestment.controller.js';
import { isExpenseRecordAvailable, deleteExpense } from './deleteExpense.controller.js';

export default {
    validateNewIncomePayload,
    validateNewIinvestmentPayload,
    getCategoryInfoByIdAndType,
    updateCardAmount,
    revertCardAmount,
    registerIncome,
    registerInvestment,
    registerExpense,
    getAllIncomeRecords,
    getIncomeInfoById,
    getAllInvestmentRecords,
    getInvestmentInfoById,
    getAllExpenseInfo,
    getExpenseInfoById,
    isIncomeRecordAvailable,
    deleteIncome,
    isInvestmentRecordAvailable,
    deleteInvestment,
    isExpenseRecordAvailable,
    deleteExpense
};
