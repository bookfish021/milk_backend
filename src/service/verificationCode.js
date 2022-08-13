import model from '../models';
import logger from '../../libs/logger';

const verificationCode = {
  async create(params) {
    try {
      const res = await model.verificationCodes.create(params);
      logger.info('[Verification Code Service] Create verification code successfully.');
      return res;
    } catch (error) {
      logger.error('[Verification Service] Failed to create verfication data to database');
      throw new Error(`Failed to create verification data to database, ${error}`);
    }
  },
  async list(params) {
    try {
      const res = await model.verificationCodes.find({}, null, { limit: params.limit, skip: params.skip });
      logger.info('[Verification Code Service] List verification code successfully');
      return res;
    } catch (error) {
      logger.error('[Verification Code Service] Failed to list verification code.');
      throw new Error(`Failed to list verification code in database, ${error}`);
    }
  },
  async update(params) {
    try {
      const filter = { _id: params.id };
      const updateParams = params;
      delete updateParams._id;
      const res = await model.verificationCodes.findOneAndUpdate(filter, updateParams, {
        new: true,
      });
      return res;
    } catch (error) {
      logger.error('[Verification Code Service] Failed to update verification code');
      throw new Error(`Failed to update verification code, ${error}`);
    }
  },
  async delete(params) {
    try {
      const verficationCode = await model.verficationCodes.findById(params._id).lean();
      // if verfication code does not exist
      if (!verficationCode) {
        logger.error('[Verification Code Service] Verification code not found');
        throw new Error('Error verification code not found');
      }
      const filter = { _id: params._id };
      const res = await model.verificationCode.deleteOne(filter);
      return res;
    } catch (error) {
      logger.error('[Verification Code Service] Failed to delete verification code');
      throw new Error(`Failed to delete verification code, ${error}`);
    }
  },
};

export default verificationCode;
