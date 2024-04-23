'use strict';

import {
    isCategoryByNameAvailable,
    createNewCategory,
    getAllCategoryInfo,
    getCategoryInfoById,
    getCategoryInfoByType,
    updateCategoryName,
    deleteCategoryById,
    getCategoryInfoByIdAndType,
    getUserFinanceById,
    updateUserFinance,
    createNewIncomeRecord,
    updateCardAmount,
    deleteIncomeRecord,
    createNewInvestmentRecord,
    deleteInvestmentRecord,
    createNewExpenseRecord,
    createNewCrdExpenseRecord,
    deleteExpenseRecord,
    deleteCrdExpenseRecord,
    updateInvAccountAmount,
    revertIncomeRecord,
    revertInvestmentRecord,
    revertExpenseRecord,
    revertCreditExpenseRecord
} from './finance.db.js';
import {
    getIncomeRecords,
    getInvestmentRecords,
    getExpenseRecords,
    getCreditExpenseRecords
} from './financeRecords.db.js';

export default {
    isCategoryByNameAvailable,
    createNewCategory,
    getAllCategoryInfo,
    getCategoryInfoById,
    getCategoryInfoByType,
    updateCategoryName,
    deleteCategoryById,
    getCategoryInfoByIdAndType,
    getUserFinanceById,
    updateUserFinance,
    createNewIncomeRecord,
    updateCardAmount,
    deleteIncomeRecord,
    createNewInvestmentRecord,
    deleteInvestmentRecord,
    createNewExpenseRecord,
    createNewCrdExpenseRecord,
    deleteExpenseRecord,
    deleteCrdExpenseRecord,
    updateInvAccountAmount,
    revertIncomeRecord,
    revertInvestmentRecord,
    revertExpenseRecord,
    revertCreditExpenseRecord,
    getIncomeRecords,
    getInvestmentRecords,
    getExpenseRecords,
    getCreditExpenseRecords
};
