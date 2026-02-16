interface Config {
  port: number;
  serverPort: number;
  apiUrl: string;
  nodeEnv: string;
}

const config: Config = {
  port: Number(import.meta.env.PORT) || 5173,
  serverPort: Number(import.meta.env.SERVER_PORT) || 3000,
  apiUrl: import.meta.env.API_URL || '/api/items',
  nodeEnv: import.meta.env.NODE_ENV || 'development',
};

export default config;