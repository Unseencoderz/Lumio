import * as Sentry from '@sentry/node';
import { config } from '../config/config';

export const initSentry = (): void => {
  if (config.sentryDsn && config.nodeEnv === 'production') {
    Sentry.init({
      dsn: config.sentryDsn,
      environment: config.nodeEnv,
      tracesSampleRate: 0.1,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app: undefined }),
      ],
    });
  }
};

export { Sentry };