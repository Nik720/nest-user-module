export default () => ({
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
    jwt_refresh_expiration_time: process.env.JWT_REFRESH_EXPIRATION_TIME || 600000
  });