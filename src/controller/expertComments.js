import validator from '../../libs/validator';
import logger from '../../libs/logger';
import service from '../service';
import { expertCommentsRule } from './validationRule';

const expertCommentsController = {
  async create(req, res) {
    try {
      req.body.date = new Date(req.body.date);
      validator.validate(req.body, expertCommentsRule);
      await service.expertComments.create(req.body, req.user._id);
      logger.info('[Expert Comments Controller] Create expert comments successfully');
      res.json({ success: true });
    } catch (error) {
      logger.error('[Expert Comments Controller] Failed to create expert comments:', error);
      res.status(400).json({ message: `Failed to create expert comments, ${error}` });
    }
  },
  async list(req, res) {
    const rule = {
      skip: {
        type: 'number',
      },
      limit: {
        type: 'number',
      },
      startDate: {
        type: 'date',
      },
      endDate: {
        type: 'date',
      },
    };

    try {
      req.body.startDate = new Date(req.body.startDate);
      req.body.endDate = new Date(req.body.endDate);
      validator.validate(req.body, rule);
      const expertComments = await service.expertComments.list(req.body, req.user._id);
      logger.info('[Expert Comments Controller] List expert comments successfully');
      res.json({ expertComments });
    } catch (error) {
      logger.error('[Expert Comments Contoller] Failed to list expert comments:', error);
      res.status(400).json({ message: `Failed to list expert comments, ${error}` });
    }
  },
  async adminList(req, res) {
    const rule = {
      skip: {
        type: 'number',
      },
      limit: {
        type: 'number',
      },
    };

    try {
      validator.validate(req.body, rule);
      const expertComments = await service.expertComments.adminList(req.body);
      logger.info('[Expert Comments Controller] Admin list expert comments successfully');
      res.json({ expertComments });
    } catch (error) {
      logger.error('[Expert Comments Contoller] Failed to do admin list expert comments:', error);
      res.status(400).json({ message: `Failed to do admin list expert comments, ${error}` });
    }
  },
  async update(req, res) {
    try {
      req.body.date = new Date(req.body.date);
      validator.validate(req.body, expertCommentsRule);
      validator.validate(req.body, {
        _id: {
          type: 'string',
        },
      });
      await service.expertComments.update(req.body, req.user._id);
      logger.info('[Expert Comments Controller] Update expert comments successfully');
      res.json({ success: true });
    } catch (error) {
      logger.error('[Expert Comments Controller] Failed to update expert comments:', error);
      res.status(400).json({ message: `Failed to udpate expert comments, ${error}` });
    }
  },
};

export default expertCommentsController;
