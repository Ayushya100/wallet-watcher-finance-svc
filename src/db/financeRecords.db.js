'use strict';

import mongoose from 'mongoose';

// Add DB Models
import {
    IncDetailsModel,
    InvDetailsModel,
    ExpDetailsModel,
    CrdExpDetailsModel,
    executeAggregation
} from 'lib-common-service';

const getIncomeRecords = async(userId, recordId = null, fieldsToDisplay) => {
    const recordsToMatch = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        isDeleted: false
    };
    if (recordId) {
        recordsToMatch._id = new mongoose.mongoose.Types.ObjectId(recordId);
    }

    const isRecordsAvailable = IncDetailsModel.aggregate([
      {
          $match: recordsToMatch
      },
      {
          $lookup: {
              from: 'cardinfos',
              localField: 'cardToken',
              foreignField: 'token',
              as: 'cardResult'
          }
      },
      {
          $lookup: {
              from: 'userwalletcategories',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'categoryResult'
          }
      },
      {
          $addFields: {
              cardNumber: {
                  $arrayElemAt: ['$cardResult.cardNumber', 0]
              },
              categoryName: {
                  $arrayElemAt: ['$categoryResult.categoryName', 0]
              }
          }
      },
      {
          $project: fieldsToDisplay
      }
    ]);
    return await executeAggregation(isRecordsAvailable);
}

const getInvestmentRecords = async(userId, recordId = null, fieldsToDisplay) => {
    const recordsToMatch = {
        userId: new mongoose.mongoose.Types.ObjectId(userId),
        isDeleted: false
    };
    if (recordId) {
        recordsToMatch._id = new mongoose.mongoose.Types.ObjectId(recordId);
    }

    const isRecordsAvailable = InvDetailsModel.aggregate([
      {
        $match: recordsToMatch
      },
      {
        $lookup: {
          from: 'cardinfos',
          localField: 'cardToken',
          foreignField: 'token',
          as: 'cardResult'
        }
      },
      {
        $lookup: {
          from: 'userwalletcategories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categoryResult'
        }
      },
      {
        $lookup: {
          from: 'investmentaccinfos',
          localField: 'investmentAccToken',
          foreignField: 'token',
          as: 'accountResult'
        }
      },
      {
        $addFields: {
          'cardNumber': {
            $arrayElemAt: ['$cardResult.cardNumber', 0]
          },
          'categoryName': {
            $arrayElemAt: ['$categoryResult.categoryName', 0]
          },
          'accountNumber': {
            $arrayElemAt: ['$accountResult.accountNumber', 0]
          }
        }
      },
      {
        $project: fieldsToDisplay
      }
    ]);
    return await executeAggregation(isRecordsAvailable);
}

const getExpenseRecords = async(userId, recordId = null, fieldsToDisplay) => {
  const recordsToMatch = {
    userId: new mongoose.mongoose.Types.ObjectId(userId),
    isDeleted: false
  };
  if (recordId) {
      recordsToMatch._id = new mongoose.mongoose.Types.ObjectId(recordId);
  }
  const isRecordsAvailable = ExpDetailsModel.aggregate([
    {
      $match: recordsToMatch
    },
    {
      $lookup: {
        from: 'cardinfos',
        localField: 'cardToken',
        foreignField: 'token',
        as: 'cardResult'
      }
    },
    {
      $lookup: {
        from: 'userwalletcategories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'categoryResult'
      }
    },
    {
      $addFields: {
        cardNumber: {
          $arrayElemAt: ['$cardResult.cardNumber', 0]
        },
        categoryName: {
          $arrayElemAt: ['$categoryResult.categoryName', 0]
        }
      }
    },
    {
      $project: fieldsToDisplay
    }
  ]);
  return await executeAggregation(isRecordsAvailable);
}

const getCreditExpenseRecords = async(userId, recordId = null, fieldsToDisplay) => {
  const recordsToMatch = {
    userId: new mongoose.mongoose.Types.ObjectId(userId),
    isDeleted: false
  };
  if (recordId) {
      recordsToMatch._id = new mongoose.mongoose.Types.ObjectId(recordId);
  }
  const isRecordsAvailable = CrdExpDetailsModel.aggregate([
    {
      $match: recordsToMatch
    },
    {
      $lookup: {
        from: 'cardinfos',
        localField: 'cardToken',
        foreignField: 'token',
        as: 'cardResult'
      }
    },
    {
      $lookup: {
        from: 'userwalletcategories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'categoryResult'
      }
    },
    {
      $addFields: {
        cardNumber: {
          $arrayElemAt: ['$cardResult.cardNumber', 0]
        },
        categoryName: {
          $arrayElemAt: ['$categoryResult.categoryName', 0]
        }
      }
    },
    {
      $project: fieldsToDisplay
    }
  ]);
  return await executeAggregation(isRecordsAvailable);
}

export {
    getIncomeRecords,
    getInvestmentRecords,
    getExpenseRecords,
    getCreditExpenseRecords
};
