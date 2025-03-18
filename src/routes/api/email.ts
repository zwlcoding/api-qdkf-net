import { FastifyInstance } from 'fastify';
import { Resend } from "resend";
import WaitlistEmail from '../../emails/waitlist'

interface SendEmailBody {
  email: string;
}



const emailRoutes = (fastify: FastifyInstance) => {

  const env = fastify.getEnvs<EnvSchema>()
  const resend = new Resend(env.RESEND_API_KEY);

  fastify.get('/health', async (request, reply): Promise<ApiResponse> => {
    return {
      code: 0,
      sub_code: '',
      msg: 'ok',
      sub_msg: '',
    }
  });


  fastify.post<{ Body: SendEmailBody }>('/send', async (request, reply): Promise<ApiResponse> => {
    if(!request.body.email) return { code: 400, sub_code: '', msg: 'email is required', sub_msg: '' };
    const reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    if(!reg.test(request.body.email)) return { code: 400, sub_code: '', msg: 'email is invalid', sub_msg: '' };
    const result = await resend.emails.send({
      // from: 'MindLink <info@updates.qdkf.net>',
      from: 'Acme <onboarding@resend.dev>',
      to: [request.body.email],
      subject: 'Mind Link - Welcome to the waitlist',
      react: WaitlistEmail({ name: request.body.email }),
    });
    if (result.error) return { code: 500, sub_code: '', msg: result.error.message, sub_msg: '' };
    return { code: 0, sub_code: '', msg: '', sub_msg: '', data: result.data?.id };
  });

}

export default emailRoutes;
