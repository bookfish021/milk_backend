import model from '../models';
import logger from '../../libs/logger';

const checkEvent = async (event) => {
  const res = await model.verificationCodes.findOne({ content: event });
  if (res === null || res.usage !== 'event') {
    throw new Error('Can not find the event in database');
  }
};

const normalCommentsService = {
  async create(params, userID) {
    try {
      const savedParams = params;
      if (savedParams.event !== '') {
        await checkEvent(savedParams.event);
      }
      savedParams.userID = userID;
      const res = await model.normalComments.create(savedParams);
      logger.info('[Normal Comments Service] Create normal comment successfully');
      return res;
    } catch (error) {
      logger.error('[Normal Comments Service] Failed to create normal comments to database');
      throw new Error(`Failed to create normal comments to database, ${error}`);
    }
  },
  async list(params) {
    try {
      const res = await model.normalComments.find({}, null, { limit: params.limit, skip: params.skip });
      logger.info('[Normal Comments Service] List normal comments successfully');
      return res;
    } catch (error) {
      logger.error('[Normal Comments Service] Failed to list normal comments', error);
      throw new Error(`Failed to list normal comments in database, ${error}`);
    }
  },
  async update(params, userID) {
    try {
      const filter = { _id: params._id, userID };
      const updateParams = params;
      delete updateParams._id;
      const res = await model.normalComments.findOneAndUpdate(filter, updateParams, {
        new: true,
      });
      return res;
    } catch (error) {
      logger.error('[Normal Comments Service] Failed to update Normal comments', error);
      throw new Error(`Failed to update Normal comments, ${error}`);
    }
  },
};

export default normalCommentsService;
