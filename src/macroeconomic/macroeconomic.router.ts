import { Hono } from 'hono';
import { exchangeRate, gdp, gdpPerCapita, population } from './macroeconomic.controller';

export const macroeconomicRouter = new Hono();

macroeconomicRouter.get('/gdp', gdp);
macroeconomicRouter.get('/population', population);
macroeconomicRouter.get('/gdp_per_capita', gdpPerCapita);
macroeconomicRouter.get('/exchange_rate', exchangeRate);