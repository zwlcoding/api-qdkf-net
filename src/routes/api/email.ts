import { Prisma, PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { Resend } from 'resend';
import WaitlistEmail from '../../emails/waitlist';
import WaitlistEmailEn from '../../emails/waitlist.en';

const prisma = new PrismaClient();


interface SendEmailBody extends Prisma.UserCreateInput {
  currentLang: string;
}


// 定义标准错误响应
const errorResponses = {
  emailRequired: {
    code: 400,
    sub_code: '',
    msg: 'email is required',
    sub_msg: '',
  },
  didRequired: { code: 400, sub_code: '', msg: 'did is required', sub_msg: '' },
  invalidEmail: {
    code: 400,
    sub_code: '',
    msg: 'email is invalid',
    sub_msg: '',
  },
  emailExists: {
    code: 400,
    sub_code: '',
    msg: 'email already exists',
    sub_msg: '',
  },
  systemError: { code: 500, sub_code: '', msg: 'system error', sub_msg: '' },
};

// 邮箱验证函数
const isValidEmail = (email: string): boolean => {
  const reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
  return reg.test(email);
};

const emailRoutes = (fastify: FastifyInstance) => {
  const env = fastify.getEnvs<EnvSchema>();
  const resend = new Resend(env.RESEND_API_KEY);

  fastify.get('/health', async (): Promise<ApiResponse> => {
    return {
      code: 0,
      sub_code: '',
      msg: 'ok',
      sub_msg: '',
    };
  });

  fastify.post<{ Body: SendEmailBody }>(
    '/send',
    async (request, reply): Promise<ApiResponse> => {
      const { email, did, name, currentLang } = request.body;

      // 参数验证
      if (!email) return reply.send(errorResponses.emailRequired);
      if (!did) return reply.send(errorResponses.didRequired);
      if (!isValidEmail(email)) return reply.send(errorResponses.invalidEmail);

      // 检查用户是否已存在
      try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return reply.send(errorResponses.emailExists);
      } catch (e) {
        fastify.log.error(e);
        return reply.send(errorResponses.systemError);
      }

      // 发送邮件
      const displayName = name || email;
      const emailResult = await resend.emails.send({
        from: 'MindLink <info@updates.qdkf.net>',
        to: [email],
        subject: 'Mind Link - Welcome to the waitlist',
        react: currentLang === 'zh' ? WaitlistEmail({ name: displayName }) : WaitlistEmailEn({ name: displayName }),
      });

      if (emailResult.error) {
        return reply.send({
          code: 500,
          sub_code: '',
          msg: emailResult.error.message,
          sub_msg: '',
        });
      }

      // 创建用户记录
      try {
        await prisma.user.create({
          data: { name: name || '', email, did },
        });
      } catch (e) {
        fastify.log.error(e);
        // 这里不返回错误，仍然告知用户邮件发送成功
      }

      return reply.send({
        code: 0,
        sub_code: '',
        msg: 'Email sent successfully',
        sub_msg: '',
        data: emailResult.data?.id,
      });
    },
  );
};

export default emailRoutes;
