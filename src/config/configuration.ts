export default () => ({
    NODE_ENV: 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      user: process.env.DATABASE_USER || "",
      password: process.env.DATABASE_PASSWORD || "",
      dbname: process.env.DATABASE_NAME || ""
    },
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiration_time: process.env.JWT_EXPIRATION_TIME || 60000,
    jwt_refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    jwt_refresh_expiration_time: process.env.JWT_REFRESH_EXPIRATION_TIME || 600000,
    LOG_DB_QUERY: process.env.LOG_DB_QUERY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
    AWS_PUBLIC_BUCKET_NAME: process.env.AWS_PUBLIC_BUCKET_NAME,

    EMAIL_SERVICE: process.env.EMAIL_SERVICE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

    
  });