type EnvSchema = {
  SERVE_HOST: string;
  SERVE_PORT: string;
  CORS_ORIGIN: string;
  CORS_METHODS: string;
  CORS_HEADERS: string;
  RESEND_API_KEY: string;
};

// 添加统一响应接口
interface ApiResponse<T = any> {
  code: number;
  sub_code: string;
  msg: string;
  sub_msg: string;
  data?: T;
}
