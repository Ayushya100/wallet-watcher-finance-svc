'use strict';

// Add DB Models
import { UserWalletCategoryModel, executeQuery } from 'lib-common-service';

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

export {
    isCategoryByNameAvailable,
    createNewCategory,
    getAllCategoryInfo,
    getCategoryInfoById,
    getCategoryInfoByType
};
