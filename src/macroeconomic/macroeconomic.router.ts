import { Hono } from 'hono';
import { exchangeRate, gdp, gdpPerCapita, inflationRate, population, safaricomSharePrices } from './macroeconomic.controller';

export const macroeconomicRouter = new Hono();

macroeconomicRouter.get('/gdp', gdp);
macroeconomicRouter.get('/population', population);
macroeconomicRouter.get('/gdp_per_capita', gdpPerCapita);
macroeconomicRouter.get('/exchange_rate', exchangeRate);
macroeconomicRouter.get('/inflation_rate', inflationRate);
macroeconomicRouter.get('/safaricom_share_prices', safaricomSharePrices);