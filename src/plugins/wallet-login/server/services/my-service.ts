import { Strapi } from '@strapi/strapi';
import { verifyMessage } from 'viem';
import type {VerifyMessageParameters} from 'viem'

export default ({ strapi }: { strapi: Strapi }) => ({

  // 钱包验证
  verifySign(data:VerifyMessageParameters) {
    return new Promise(async (resolve, reject) => {
      try{
        const {signature, message, address} = data;
        if(!signature || !message || !address){
          return resolve({error: true, data: null, message: 'Signature and address are required'})
        }
        const result = await verifyMessage({
          signature,
          message,
          address
        });

        if(!result){
          return resolve({error: true, data: null, message: 'Signature is not valid'})
        }

        // 查找是否存在用户
        const user = await strapi.db.query('plugin::users-permissions.user').findOne({where: {wallet: address}});

        // 没用户则创建用户，只记录钱包地址
        if(!user){
          let newUser = await strapi.db.query('plugin::users-permissions.user').create({
            data: {
              wallet: address,
              blocked: false,
              confirmed: true,
              role: 1,
              provider: 'local'
            }
          });
          return resolve({
            error: false,
            data: {
              token: strapi.plugin('users-permissions').service('jwt').issue({id: newUser.id})
            },
            message: 'User created successfully'
          })
        }

        // 如果用户被禁用，则不颁发jwt
        if(user.blocked){
          return resolve({error: true, data: null, message: 'User is blocked'})
        }

        // 颁发jwt
        return resolve({
          error: false,
          data: {
            token: strapi.plugin('users-permissions').service('jwt').issue({id: user.id})
          },
          message: 'User login successfully'
        })
      }catch(error){
        return reject({error: true, message: error.message})
      }
    });
  }
});
