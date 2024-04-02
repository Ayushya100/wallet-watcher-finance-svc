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

export {
    isCategoryByNameAvailable,
    createNewCategory
};
