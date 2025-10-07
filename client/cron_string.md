# Cron String [5 or 6 symbols long]

- \* Means all
- \* \* \* \* \* \* < command-to-execute >
- Sec Min Hr Day_of_month month day_of_week(0-7)
- 0 & 7 are both sundays
- Seconds is optional
- \* /15 \* \* \* \* -> Runs Every 15 Mins
- / -> Denote Step Value


# PM Service For Persistance Node Cron Job
- pm2 start server.js --name "cron-service-automatic"
- pm2 startup
- sudo env PATH=$PATH:/Users/prabhjeet1/.nvm/versions/node/v22.19.0/bin /Users/prabhjeet1/.nvm/versions/node/v22.19.0/lib/node_modules/pm2/bin/pm2 startup launchd -u prabhjeet1 --hp /Users/prabhjeet1
- pm2 save
