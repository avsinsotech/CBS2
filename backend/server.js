
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

require('dotenv').config();
const express = require('express');

const cors = require('cors');
const compression = require('compression');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const glReportRoutes = require('./routes/glReport');
const balanceRegisterRoutes = require('./routes/balanceRegister');
const productWiseSummaryRoutes = require('./routes/productWiseSummary');
const profitAndLossRoutes = require('./routes/profitAndLoss');
const loanDepoRegRoutes = require('./routes/loanDepoReg');
const closingRoutes = require('./routes/closing');
const cuteBookDetailsRoutes = require('./routes/cuteBookDetails');
const smsReportRoutes = require('./routes/smsReport');
const fifteenGHRoutes = require('./routes/fifteenGH');
const daybookRoutes = require('./routes/daybook');
const cashbookRoutes = require('./routes/cashbook');
const ctrReportRoutes = require('./routes/ctrReport');
const kycReportRoutes = require('./routes/kycReport');
const cdRatioReportRoutes = require('./routes/cdRatioReport');
const siReportRoutes = require('./routes/siReport');
const accountOpenCloseRoutes = require('./routes/accountOpenClose');
const branchWiseDepositLoansRoutes = require('./routes/branchWiseDepositLoans');
const dailyBalLessThanClgRoutes = require('./routes/dailyBalLessThanClg');
const tdsReportRoutes = require('./routes/tdsReport');
const chairmanReportRoutes = require('./routes/chairmanReport');
const loanAgainstFDRoutes = require('./routes/loanAgainstFD');
const goldLoanSanctionRoutes = require('./routes/goldLoanSanction');
const depositLoanStatementRoutes = require('./routes/depositLoanStatement');




const app = express();
app.use(compression()); // gzip compress all responses
app.use(cors());
app.use(express.json());

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Banking API',
            version: '1.0.0',
            description: 'API Documentation for Banking Application',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        syntaxHighlight: false,       // Disable syntax highlighting for large responses
        defaultModelsExpandDepth: -1, // Don't expand models
        docExpansion: 'list',         // Collapse endpoints by default
    }
}));

app.use('/api/gl-report', glReportRoutes);
app.use('/api/balance-register', balanceRegisterRoutes);
app.use('/api/product-wise-summary', productWiseSummaryRoutes);
app.use('/api/profit-and-loss', profitAndLossRoutes);
app.use('/api/loan-depo-reg', loanDepoRegRoutes);
app.use('/api/closing', closingRoutes);
app.use('/api/cute-book-details', cuteBookDetailsRoutes);
app.use('/api/sms-report', smsReportRoutes);
app.use('/api/15gh-submit-report', fifteenGHRoutes);
app.use('/api/daybook', daybookRoutes);
app.use('/api/cashbook', cashbookRoutes);
app.use('/api/ctr-report', ctrReportRoutes);
app.use('/api/kyc-report', kycReportRoutes);
app.use('/api/cd-ratio-report', cdRatioReportRoutes);
app.use('/api/si-report', siReportRoutes);
app.use('/api/account-open-close', accountOpenCloseRoutes);
app.use('/api/branchwise-deposit-loans', branchWiseDepositLoansRoutes);
app.use('/api/daily-balance-less-than-clg', dailyBalLessThanClgRoutes);
app.use('/api/tds-report', tdsReportRoutes);
app.use('/api/chairman-report', chairmanReportRoutes);
app.use('/api/loan-against-fd', loanAgainstFDRoutes);
app.use('/api/gold-loan-sanction', goldLoanSanctionRoutes);
app.use('/api/deposit-loan-statement', depositLoanStatementRoutes);




const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
server.timeout = 600000; // 10 minutes
server.keepAliveTimeout = 600000;
server.headersTimeout = 601000;
