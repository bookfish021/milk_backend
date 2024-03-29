import argon2 from 'argon2';
import model from '../models';
import logger from '../../libs/logger';
import verificationCode from './verificationCode';

const userService = {
  async create(params) {
    try {
      const savedParams = params;
      if (savedParams.role === 'expert') {
        await verificationCode.verify(savedParams.verificationCode, 'expert');
        delete savedParams.verificationCode;
      }
      const hash = await argon2.hash(params.password);
      savedParams.password = hash;
      const res = await model.users.create(savedParams);
      logger.info('[User Service] Create user successfully');
      return res;
    } catch (error) {
      logger.error('[User Service] Failed to create user to database:', error);
      throw new Error(`Failed to create user to database, ${error}`);
    }
  },
  async get(id) {
    try {
      const res = await model.users.findOne({ _id: id }).lean();
      logger.info('[User Service] Get user successfully');
      delete res.password;
      return res;
    } catch (error) {
      logger.error('[User Service] Failed to get user in database:', error);
      throw new Error(`Failed to get user in database, ${error}`);
    }
  },
  async list(params) {
    try {
      const res = await model.users.find({}, null, { limit: params.limit, skip: params.skip });
      logger.info('[User Service] List user successfully');
      return res;
    } catch (error) {
      logger.error('[User Service] Failed to list users in database:', error);
      throw new Error(`Failed to list users in database, ${error}`);
    }
  },
  async updatePassword(params, id) {
    try {
      const user = await model.users.findById(id).lean();
      // if user not exists
      if (!user) {
        logger.error('[User Service] User not found');
        throw new Error('Error user not found');
      }
      // validate user old password if correspond to db's password
      const validPassword = await argon2.verify(user.password, params.oldPassword);
      if (!validPassword) {
        logger.error('[User Service] User password was incorrect');
        throw new Error('User password was incorrect');
      }
      // find user id and update password
      const hashedPassword = await argon2.hash(params.newPassword);
      const filter = { _id: id };
      const update = { password: hashedPassword };
      const res = await model.users.findOneAndUpdate(filter, update, {
        new: true,
      });
      return res;
    } catch (error) {
      logger.error('[User Service] Failed to update user password:', error);
      throw new Error(`Failed to update user password, ${error}`);
    }
  },
  async resetPassword(params) {
    try {
      const hashedPassword = await argon2.hash(params.account.substr(-4));
      const filter = { account: params.account };
      const update = { password: hashedPassword };
      const res = await model.users.findOneAndUpdate(filter, update, {
        new: true,
      });
      return res;
    } catch (error) {
      logger.error('[User Service] Failed to reset user password:', error);
      throw new Error(`Failed to reset user password, ${error}`);
    }
  },
};

export default userService;
