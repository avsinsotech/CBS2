


// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const compression = require('compression');
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');
// const glReportRoutes = require('./routes/glReport');
// const balanceRegisterRoutes = require('./routes/balanceRegister');
// const productWiseSummaryRoutes = require('./routes/productWiseSummary');
// const profitAndLossRoutes = require('./routes/profitAndLoss');
// const loanDepoRegRoutes = require('./routes/loanDepoReg');
// const closingRoutes = require('./routes/closing');
// const cuteBookDetailsRoutes = require('./routes/cuteBookDetails');
// const smsReportRoutes = require('./routes/smsReport');
// const fifteenGHRoutes = require('./routes/fifteenGH');
// const daybookRoutes = require('./routes/daybook');
// const cashbookRoutes = require('./routes/cashbook');
// const trialBalanceRoutes = require('./routes/trialBalance');

// const app = express();
// app.use(compression()); // gzip compress all responses

// // app.use(cors());
// app.use(cors({
//   origin: "*",  // you already have this — but it may not have been redeployed
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// // Add this line BEFORE your routes
// app.options("*", cors());
// app.use(cors({ origin: "*" }));

// app.use(express.json());

// // Swagger setup
// const swaggerOptions = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Banking API',
//             version: '1.0.0',
//             description: 'API Documentation for Banking Application',
//         },
//         servers: [
//             {
//                 url: `http://localhost:${process.env.PORT || 5000}`,
//             },
//         ],
//     },
//     apis: ['./routes/*.js'], // Path to the API routes
// };

// const swaggerSpec = swaggerJsdoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
//     swaggerOptions: {
//         syntaxHighlight: false,       // Disable syntax highlighting for large responses
//         defaultModelsExpandDepth: -1, // Don't expand models
//         docExpansion: 'list',         // Collapse endpoints by default
//     }
// }));

// app.use('/api/gl-report', glReportRoutes);
// app.use('/api/balance-register', balanceRegisterRoutes);
// app.use('/api/product-wise-summary', productWiseSummaryRoutes);
// app.use('/api/profit-and-loss', profitAndLossRoutes);
// app.use('/api/loan-depo-reg', loanDepoRegRoutes);
// app.use('/api/closing', closingRoutes);
// app.use('/api/cute-book-details', cuteBookDetailsRoutes);
// app.use('/api/sms-report', smsReportRoutes);
// app.use('/api/15gh-submit-report', fifteenGHRoutes);
// app.use('/api/daybook', daybookRoutes);
// app.use('/api/cashbook', cashbookRoutes);
// app.use('/api/trial-balance', trialBalanceRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


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
const trialBalanceRoutes = require('./routes/trialBalance');
const balanceSheetRoutes = require('./routes/balanceSheet');
const branchWiseGLRoutes = require('./routes/branchWiseGL');
const receiptPaymentRoutes = require('./routes/receiptPayment');
const recPayBalanceRoutes = require('./routes/recPayBalance');
const branchAdjustmentRoutes = require('./routes/branchAdjustment');

// Restored routes
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
const rateWiseDepositLoanRoutes = require('./routes/rateWiseDepositLoan');
const inOperativeAccListRoutes = require('./routes/inOperativeAccList');
const crrSlrReportRoutes = require('./routes/crrSlrReport');
const crarReportRoutes = require('./routes/crarReport');
const documentRegisterRoutes = require('./routes/documentRegister');
const allOkReportRoutes = require('./routes/allOkReport');

const app = express();

// ✅ CORS — must be first, before everything else
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight requests

app.use(compression());
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
                url: `https://cbsapi.avsinsotech.com:8596`,
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        syntaxHighlight: false,
        defaultModelsExpandDepth: -1,
        docExpansion: 'list',
    }
}));

// Routes
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
app.use('/api/trial-balance', trialBalanceRoutes);
app.use('/api/balance-sheet', balanceSheetRoutes);
app.use('/api/branch-wise-gl', branchWiseGLRoutes);
app.use('/api/receipt-payment', receiptPaymentRoutes);
app.use('/api/rec-pay-balance', recPayBalanceRoutes);
app.use('/api/branch-adjustment', branchAdjustmentRoutes);

// Restored routes mapping
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
app.use('/api/rate-wise-deposit-loan', rateWiseDepositLoanRoutes);
app.use('/api/inoperative-acc-list', inOperativeAccListRoutes);
app.use('/api/crr-slr-report', crrSlrReportRoutes);
app.use('/api/crar-report', crarReportRoutes);
app.use('/api/document-register', documentRegisterRoutes);
app.use('/api/all-ok-report', allOkReportRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Restored 10-minute HTTP timeouts for long-running reports
server.timeout = 600000;
server.keepAliveTimeout = 600000;
server.headersTimeout = 601000;