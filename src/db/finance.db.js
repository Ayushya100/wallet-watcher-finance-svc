'use strict';

// Add DB Models
import {
    UserWalletCategoryModel,
    UserFinanceModel,
    IncDetailsModel,
    CardInfoModel,
    InvDetailsModel,
    ExpDetailsModel,
    CrdExpDetailsModel,
    executeQuery
} from 'lib-common-service';

const isCategoryByNameAvailable = async(payload) => {
    const categoryDetails = UserWalletCategoryModel.findOne({
        userId: payload.userId,
        categoryType: payload.categoryType,
        categoryName: payload.categoryName,
        isDeleted: false
    }).select(
        'userId categoryType categoryName'
    );
    return await executeQuery(categoryDetails);
}

const createNewCategory = async(payload) => {
    const categoryDetails = await UserWalletCategoryModel.create({
        userId: payload.userId,
        categoryType: payload.categoryType,
        categoryName: payload.categoryName
    });

    return categoryDetails;
}

const getAllCategoryInfo = async(userId) => {
    const categoryDetails = UserWalletCategoryModel.find({
        userId: userId,
        isDeleted: false
    }).select(
        'categoryName categoryType'
    );
    return await executeQuery(categoryDetails);
}

const getCategoryInfoById = async(userId, categoryId) => {
    const categoryDetails = UserWalletCategoryModel.find({
        _id: categoryId,
        userId: userId,
        isDeleted: false
    }).select(
        'categoryName categoryType'
    );
    return await executeQuery(categoryDetails);
}

const getCategoryInfoByType = async(userId, categoryType) => {
    const categoryDetails = UserWalletCategoryModel.find({
        userId: userId,
        categoryType: categoryType,
        isDeleted: false
    }).select(
        'categoryName categoryType'
    );
    return await executeQuery(categoryDetails);
}

const updateCategoryName = async(categoryId, payload) => {
    const updatedCategoryDetails = UserWalletCategoryModel.findOneAndUpdate(
        {
            _id: categoryId,
            userId: payload.userId,
            isDeleted: false
        },
        {
            $set: {
                categoryName: payload.categoryName,
                modifiedOn: Date.now(),
                modifiedBy: payload.userId
            }
        },
        {
            new: true
        }
    ).select(
        'userId categoryName categoryType'
    );
    return await executeQuery(updatedCategoryDetails);
}

const deleteCategoryById = async(userId, categoryId) => {
    const updatedCategoryDetails = UserWalletCategoryModel.findOneAndUpdate(
        {
            _id: categoryId,
            userId: userId,
            isDeleted: false
        },
        {
            $set: {
                isDeleted: true,
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        'userId categoryName categoryType isDeleted'
    );
    return await executeQuery(updatedCategoryDetails);
}

const getCategoryInfoByIdAndType = async(userId, categoryId, categoryType) => {
    const categoryDetails = UserWalletCategoryModel.find({
        _id: categoryId,
        userId: userId,
        categoryType: categoryType,
        isDeleted: false
    }).select(
        'categoryName categoryType'
    );
    return await executeQuery(categoryDetails);
}

const getUserFinanceById = async(userId) => {
    const financeDetails = UserFinanceModel.find({
        userId: userId
    }).select(
        'availableFunds lifeTimeIncome lifeTimeInvestment lifeTimeExpenditure'
    );
    return await executeQuery(financeDetails);
}

const updateUserFinance = async(userId, financeDetails) => {
    const updatedFinanceDetails = UserFinanceModel.findByIdAndUpdate(
        {
            _id: financeDetails._id
        },
        {
            $set: {
                availableFunds: financeDetails.availableFunds,
                lifeTimeIncome: financeDetails.lifeTimeIncome,
                lifeTimeInvestment: financeDetails.lifeTimeInvestment,
                lifeTimeExpenditure: financeDetails.lifeTimeExpenditure,
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        'userId balance isActive isDeleted'
    );
    return await executeQuery(updatedFinanceDetails);
}

const createNewIncomeRecord = async(payload) => {
    const incomeDetails = await IncDetailsModel.create({
        userId: payload.userId,
        categoryId: payload.categoryId,
        cardToken: payload.cardToken,
        amount: payload.amount,
        detail: payload.detail,
        transactionDate: payload.transactionDate
    });
    return incomeDetails;
}

const updateCardAmount = async(userId, cardToken, amount) => {
    const updatedCategoryDetails = CardInfoModel.findOneAndUpdate(
        {
            token: cardToken,
            isActive: true,
            isDeleted: false
        },
        {
            $set: {
                balance: amount,
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        'userId balance isActive isDeleted'
    );
    return await executeQuery(updatedCategoryDetails);
}

const deleteIncomeRecord = async(incomeId, userId) => {
    const incomeDetails = IncDetailsModel.deleteOne(
        {
            _id: incomeId,
            userId: userId
        }
    );
    return await executeQuery(incomeDetails);
}

const createNewInvestmentRecord = async(payload) => {
    const investmentDetails = await InvDetailsModel.create({
        userId: payload.userId,
        categoryId: payload.categoryId,
        investmentAccToken: payload.investmentAccToken,
        cardToken: payload.cardToken,
        amount: payload.amount,
        detail: payload.detail,
        transactionDate: payload.transactionDate
    });
    return investmentDetails;
}

const deleteInvestmentRecord = async(investmentId, userId) => {
    const investmentDetails = InvDetailsModel.deleteOne(
        {
            _id: investmentId,
            userId: userId
        }
    );
    return await executeQuery(investmentDetails);
}

const createNewExpenseRecord = async(payload) => {
    const expenseDetails = await ExpDetailsModel.create({
        userId: payload.userId,
        categoryId: payload.categoryId,
        cardToken: payload.cardToken,
        amount: payload.amount,
        detail: payload.detail,
        transactionDate: payload.transactionDate
    });
    return expenseDetails;
}

const createNewCrdExpenseRecord = async(payload) => {
    const expenseDetails = await CrdExpDetailsModel.create({
        userId: payload.userId,
        categoryId: payload.categoryId,
        cardToken: payload.cardToken,
        amount: payload.amount,
        detail: payload.detail,
        transactionDate: payload.transactionDate
    });
    return expenseDetails;
}

const deleteExpenseRecord = async(expenseId, userId) => {
    const expenseDetails = ExpDetailsModel.deleteOne(
        {
            _id: expenseId,
            userId: userId
        }
    );
    return await executeQuery(expenseDetails);
}

const deleteCrdExpenseRecord = async(expenseId, userId) => {
    const expenseDetails = CrdExpDetailsModel.deleteOne(
        {
            _id: expenseId,
            userId: userId
        }
    );
    return await executeQuery(expenseDetails);
}

const revertIncomeRecord = async(userId, recordId) => {
    const incomeDetails = IncDetailsModel.findOneAndUpdate(
        {
            _id: recordId,
            userId: userId
        },
        {
            $set: {
                isDeleted: true,
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        'amount detail transactionDate'
    );
    return await executeQuery(incomeDetails);
}

export {
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
    revertIncomeRecord
};
