'use strict';

// Add DB Models
import {
    UserWalletCategoryModel,
    IncDetailsModel,
    CardInfoModel,
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

export {
    isCategoryByNameAvailable,
    createNewCategory,
    getAllCategoryInfo,
    getCategoryInfoById,
    getCategoryInfoByType,
    updateCategoryName,
    deleteCategoryById,
    getCategoryInfoByIdAndType,
    createNewIncomeRecord,
    updateCardAmount,
    deleteIncomeRecord
};
