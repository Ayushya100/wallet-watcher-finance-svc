'use strict';

import registerIncome from './registerIncome.route.js';
import registerInvestment from './registerInvestment.route.js';
import registerExpense from './registerExpense.route.js';
import getIncomeInfo from './getIncomeInfo.route.js';
import getInvestmentInfo from './getInvestmentInfo.route.js';
import getExpenseInfo from './getExpenseInfo.route.js';
import deleteIncome from './deleteIncome.route.js';

export default {
    registerIncome,
    registerInvestment,
    registerExpense,
    getIncomeInfo,
    getInvestmentInfo,
    getExpenseInfo,
    deleteIncome
};
