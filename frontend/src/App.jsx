// import { Routes, Route } from 'react-router-dom'
// import Layout from './components/Layout'
// import Dashboard from './pages/Dashboard'
// import Master from './pages/Master'
// import Reports from './pages/Reports'
// import Settings from './pages/Settings'

// // ── General Ledger ────────────────────────────────────────────────────────────
// import GLReport from './pages/GLReport'
// import ACBalanceRegister from './pages/ACBalanceRegister'
// import GeneralLedgerWise from './pages/GeneralLedgerWise'
// import ProfitAndLoss from './pages/ProfitAndLoss'
// import GeneralLedger from './pages/GeneralLedger'
// import TrialBalance from './pages/TrialBalance'
// import BalanceSheet from './pages/BalanceSheet'
// import BranchwiseGLReport from './pages/BranchwiseGLReport'
// import ReciptPaymentReport from './pages/ReciptPaymentReport'
// import ReceiptPaymentWithBal from './pages/ReceiptPaymentWithBal'
// import BranchAdjustment from './pages/BranchAdjustment'

// // ── Daily Reports ─────────────────────────────────────────────────────────────
// import DailyCashbook from './pages/DailyCashbook'
// import DailyDaybook from './pages/DailyDaybook'

// import VoucherSubBook from './pages/VoucherSubBook'
// import VoucherPrinting from './pages/VoucherPrinting'
// import FinancialYear from './pages/FinancialYear'
// import DailyPositionReport from './pages/DailyPositionReport'


// // ── Monthly Reports ───────────────────────────────────────────────────────────
// import LoanDepositRegister from './pages/LoanDepositRegister'
// import CutBook from './pages/CutBook'
// import DocumentRegister from './pages/DocumentRegister'
// import CTRReport from './pages/CTRReport'
// import KYCReport from './pages/KYCReport'
// import CDRatioReport from './pages/CDRatioReport'
// import SMSReport from './pages/SMSReport'
// import SIReport from './pages/SIReport'
// import AccountOpenCloseReport from './pages/AccountOpenCloseReport'
// import BranchWiseDepositLoans from './pages/BranchWiseDepositLoans'
// import InOperativeAccList from './pages/InOperativeAccList'
// import DailyBalLessThanClg from './pages/DailyBalLessThanClg'
// import TDSReport from './pages/TDSReport'
// import CRRSLRReport from './pages/CRRSLRReport'
// import CRARReport from './pages/CRARReport'

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Layout />}>

//         {/* Core */}
//         <Route index element={<Dashboard />} />
//         <Route path="master"   element={<Master />} />
//         <Route path="reports"  element={<Reports />} />
//         <Route path="settings" element={<Settings />} />

//         {/* General Ledger */}
//         <Route path="reports/general-ledger/gl-report"                element={<GLReport />} />
//         <Route path="reports/general-ledger/ac-balance-register"      element={<ACBalanceRegister />} />
//         <Route path="reports/general-ledger/ledger-wise"              element={<GeneralLedgerWise />} />
//         <Route path="reports/general-ledger/profit-and-loss"          element={<ProfitAndLoss />} />
//         <Route path="reports/general-ledger/general-ledger"           element={<GeneralLedger />} />
//         <Route path="reports/general-ledger/trial-balance"            element={<TrialBalance />} />
//         <Route path="reports/general-ledger/balance-sheet"            element={<BalanceSheet />} />
//         <Route path="reports/general-ledger/branchwise-gl-report"     element={<BranchwiseGLReport />} />
//         <Route path="reports/general-ledger/receipt-payment-report"   element={<ReciptPaymentReport />} />
//         <Route path="reports/general-ledger/receipt-payment-with-bal" element={<ReceiptPaymentWithBal />} />
//         <Route path="reports/general-ledger/branch-adjustment"        element={<BranchAdjustment />} />

//         {/* Daily */}
//         <Route path="reports/daily/cashbook" element={<DailyCashbook />} />
//         <Route path="reports/daily/daybook"  element={<DailyDaybook />} />
//         <Route path="reports/daily/vouchersub-book" element={<VoucherSubBook />} />
//         <Route path="reports/daily/voucher-printing" element={<VoucherPrinting />} />
//         <Route path="reports/daily/daily-position-report" element={<DailyPositionReport />} />

        

//         {/* Monthly */}
//         <Route path="loan-deposit-register"             element={<LoanDepositRegister />} />
//         <Route path="cut-book"                          element={<CutBook />} />
//         <Route path="document-register"                 element={<DocumentRegister />} />
//         <Route path="ctr-report"                        element={<CTRReport />} />
//         <Route path="kyc-report"                        element={<KYCReport />} />
//         <Route path="cd-ratio-report"                   element={<CDRatioReport />} />
//         <Route path="sms-report"                        element={<SMSReport />} />
//         <Route path="si-report"                         element={<SIReport />} />
//         <Route path="reports/account-open-close"        element={<AccountOpenCloseReport />} />
//         <Route path="reports/branch-wise-deposit-loans" element={<BranchWiseDepositLoans />} />
//         <Route path="inoperative-acc-list"              element={<InOperativeAccList />} />
//         <Route path="daily-bal-less-than-clg"           element={<DailyBalLessThanClg />} />
//         <Route path="tds-report"                        element={<TDSReport />} />
//         <Route path="crr-slr-report"                    element={<CRRSLRReport />} />
//         <Route path="crar-report"                       element={<CRARReport />} />

//       </Route>
//     </Routes>
//   )
// }

// export default App

// import { Routes, Route } from 'react-router-dom'
// import Layout from './components/Layout'
// import Dashboard from './pages/Dashboard'
// import Master from './pages/Master'
// import Reports from './pages/Reports'
// import Settings from './pages/Settings'

// // ── General Ledger ────────────────────────────────────────────────────────────
// import GLReport from './pages/GLReport'
// import ACBalanceRegister from './pages/ACBalanceRegister'
// import GeneralLedgerWise from './pages/GeneralLedgerWise'
// import ProfitAndLoss from './pages/ProfitAndLoss'
// import GeneralLedger from './pages/GeneralLedger'
// import TrialBalance from './pages/TrialBalance'
// import BalanceSheet from './pages/BalanceSheet'
// import BranchwiseGLReport from './pages/BranchwiseGLReport'
// import ReciptPaymentReport from './pages/ReciptPaymentReport'
// import ReceiptPaymentWithBal from './pages/ReceiptPaymentWithBal'
// import BranchAdjustment from './pages/BranchAdjustment'

// // ── Daily Reports ─────────────────────────────────────────────────────────────
// import DailyCashbook from './pages/DailyCashbook'
// import DailyDaybook from './pages/DailyDaybook'

// import VoucherSubBook from './pages/VoucherSubBook'
// import VoucherPrinting from './pages/VoucherPrinting'
// import FinancialYear from './pages/FinancialYear'
// import DailyPositionReport from './pages/DailyPositionReport'


// // ── Monthly Reports ───────────────────────────────────────────────────────────
// import LoanDepositRegister from './pages/LoanDepositRegister'
// import CutBook from './pages/CutBook'
// import DocumentRegister from './pages/DocumentRegister'
// import CTRReport from './pages/CTRReport'
// import KYCReport from './pages/KYCReport'
// import CDRatioReport from './pages/CDRatioReport'
// import SMSReport from './pages/SMSReport'
// import SIReport from './pages/SIReport'
// import AccountOpenCloseReport from './pages/AccountOpenCloseReport'
// import BranchWiseDepositLoans from './pages/BranchWiseDepositLoans'
// import InOperativeAccList from './pages/InOperativeAccList'
// import DailyBalLessThanClg from './pages/DailyBalLessThanClg'
// import TDSReport from './pages/TDSReport'
// import CRRSLRReport from './pages/CRRSLRReport'
// import CRARReport from './pages/CRARReport'

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Layout />}>

//         {/* Core */}
//         <Route index element={<Dashboard />} />
//         <Route path="master"   element={<Master />} />
//         <Route path="reports"  element={<Reports />} />
//         <Route path="settings" element={<Settings />} />

//         {/* General Ledger */}
//         <Route path="reports/general-ledger/gl-report"                element={<GLReport />} />
//         <Route path="reports/general-ledger/ac-balance-register"      element={<ACBalanceRegister />} />
//         <Route path="reports/general-ledger/ledger-wise"              element={<GeneralLedgerWise />} />
//         <Route path="reports/general-ledger/profit-and-loss"          element={<ProfitAndLoss />} />
//         <Route path="reports/general-ledger/general-ledger"           element={<GeneralLedger />} />
//         <Route path="reports/general-ledger/trial-balance"            element={<TrialBalance />} />
//         <Route path="reports/general-ledger/balance-sheet"            element={<BalanceSheet />} />
//         <Route path="reports/general-ledger/branchwise-gl-report"     element={<BranchwiseGLReport />} />
//         <Route path="reports/general-ledger/receipt-payment-report"   element={<ReciptPaymentReport />} />
//         <Route path="reports/general-ledger/receipt-payment-with-bal" element={<ReceiptPaymentWithBal />} />
//         <Route path="reports/general-ledger/branch-adjustment"        element={<BranchAdjustment />} />

//         {/* Daily */}
//         <Route path="reports/daily/cashbook" element={<DailyCashbook />} />
//         <Route path="reports/daily/daybook"  element={<DailyDaybook />} />
//         <Route path="reports/daily/vouchersub-book" element={<VoucherSubBook />} />
//         <Route path="reports/daily/voucher-printing" element={<VoucherPrinting />} />
//         <Route path="reports/daily/daily-position-report" element={<DailyPositionReport />} />

        

//         {/* Monthly */}
//         <Route path="loan-deposit-register"             element={<LoanDepositRegister />} />
//         <Route path="cut-book"                          element={<CutBook />} />
//         <Route path="document-register"                 element={<DocumentRegister />} />
//         <Route path="ctr-report"                        element={<CTRReport />} />
//         <Route path="kyc-report"                        element={<KYCReport />} />
//         <Route path="cd-ratio-report"                   element={<CDRatioReport />} />
//         <Route path="sms-report"                        element={<SMSReport />} />
//         <Route path="si-report"                         element={<SIReport />} />
//         <Route path="reports/account-open-close"        element={<AccountOpenCloseReport />} />
//         <Route path="reports/branch-wise-deposit-loans" element={<BranchWiseDepositLoans />} />
//         <Route path="inoperative-acc-list"              element={<InOperativeAccList />} />
//         <Route path="daily-bal-less-than-clg"           element={<DailyBalLessThanClg />} />
//         <Route path="tds-report"                        element={<TDSReport />} />
//         <Route path="crr-slr-report"                    element={<CRRSLRReport />} />
//         <Route path="crar-report"                       element={<CRARReport />} />

//       </Route>
//     </Routes>
//   )
// }

// export default App

import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Master from './pages/Master'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

// ── General Ledger ────────────────────────────────────────────────────────────
import GLReport from './pages/GLReport'
import ACBalanceRegister from './pages/ACBalanceRegister'
import GeneralLedgerWise from './pages/GeneralLedgerWise'
import ProfitAndLoss from './pages/ProfitAndLoss'
import GeneralLedger from './pages/GeneralLedger'
import TrialBalance from './pages/TrialBalance'
import BalanceSheet from './pages/BalanceSheet'
import BranchwiseGLReport from './pages/BranchwiseGLReport'
import ReciptPaymentReport from './pages/ReciptPaymentReport'
import ReceiptPaymentWithBal from './pages/ReceiptPaymentWithBal'
import BranchAdjustment from './pages/BranchAdjustment'

// ── Daily Reports ─────────────────────────────────────────────────────────────
import DailyCashbook from './pages/DailyCashbook'
import DailyDaybook from './pages/DailyDaybook'
import VoucherSubBook from './pages/VoucherSubBook'
import VoucherPrinting from './pages/VoucherPrinting'
import ScrollPrinting from './pages/ScrollPrinting'
import DebitEntryReport from './pages/DebitEntryReport'
import FinancialYear from './pages/FinancialYear'
import DailyPositionReport from './pages/DailyPositionReport'
import UnpassEntriesRegister from './pages/UnpassEntriesRegister'
import SupplementaryPrinting from './pages/SupplementaryPrinting'
import AuditTrialReport from './pages/AuditTrialReport'


// ── Monthly Reports ───────────────────────────────────────────────────────────
import LoanDepositRegister from './pages/LoanDepositRegister'
import CutBook from './pages/CutBook'
import DocumentRegister from './pages/DocumentRegister'
import CTRReport from './pages/CTRReport'
import KYCReport from './pages/KYCReport'
import CDRatioReport from './pages/CDRatioReport'
import SMSReport from './pages/SMSReport'
import SIReport from './pages/SIReport'
import AccountOpenCloseReport from './pages/AccountOpenCloseReport'
import BranchWiseDepositLoans from './pages/BranchWiseDepositLoans'
import InOperativeAccList from './pages/InOperativeAccList'
import DailyBalLessThanClg from './pages/DailyBalLessThanClg'
import TDSReport from './pages/TDSReport'
import CRRSLRReport from './pages/CRRSLRReport'
import CRARReport from './pages/CRARReport'

// Restored Monthly Reports
import ChairmanReport from "./pages/ChairmanReport";
import LoanAgainstFD from "./pages/LoanAgainstFD";
import GoldLoanSanction from "./pages/GoldLoanSanction";
import AllOkReport from "./pages/AllOkReport";
import DepositLoanStatement from "./pages/DepositLoanStatement";
import LoanSummary from "./pages/LoanSummary";
import LoanDefaulterList from "./pages/LoanDefaulterList";
import RateWiseDepositLoan from "./pages/RateWiseDepositLoan";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* Core */}
        <Route index element={<Dashboard />} />
        <Route path="master"   element={<Master />} />
        <Route path="reports"  element={<Reports />} />
        <Route path="settings" element={<Settings />} />

        {/* General Ledger */}
        <Route path="reports/general-ledger/gl-report"                element={<GLReport />} />
        <Route path="reports/general-ledger/ac-balance-register"      element={<ACBalanceRegister />} />
        <Route path="reports/general-ledger/ledger-wise"              element={<GeneralLedgerWise />} />
        <Route path="reports/general-ledger/profit-and-loss"          element={<ProfitAndLoss />} />
        <Route path="reports/general-ledger/general-ledger"           element={<GeneralLedger />} />
        <Route path="reports/general-ledger/trial-balance"            element={<TrialBalance />} />
        <Route path="reports/general-ledger/balance-sheet"            element={<BalanceSheet />} />
        <Route path="reports/general-ledger/branchwise-gl-report"     element={<BranchwiseGLReport />} />
        <Route path="reports/general-ledger/receipt-payment-report"   element={<ReciptPaymentReport />} />
        <Route path="reports/general-ledger/receipt-payment-with-bal" element={<ReceiptPaymentWithBal />} />
        <Route path="reports/general-ledger/branch-adjustment"        element={<BranchAdjustment />} />

        {/* Daily */}
        <Route path="reports/daily/cashbook" element={<DailyCashbook />} />
        <Route path="reports/daily/daybook"  element={<DailyDaybook />} />
        <Route path="reports/daily/vouchersub-book" element={<VoucherSubBook />} />
        <Route path="reports/daily/voucher-printing" element={<VoucherPrinting />} />
        <Route path="reports/daily/scroll-printing" element={<ScrollPrinting />} />
        <Route path="reports/daily/debit-entry-report" element={<DebitEntryReport />} />
        <Route path="reports/daily/daily-position-report" element={<DailyPositionReport />} />
        <Route path="reports/daily/unpass-entries" element={<UnpassEntriesRegister />} />
        <Route path="reports/daily/supplementary-printing" element={<SupplementaryPrinting />} />
        <Route path="reports/daily/audit-trial-report" element={<AuditTrialReport />} />

        

        {/* Monthly */}
        <Route path="loan-deposit-register"             element={<LoanDepositRegister />} />
        <Route path="cut-book"                          element={<CutBook />} />
        <Route path="document-register"                 element={<DocumentRegister />} />
        <Route path="ctr-report"                        element={<CTRReport />} />
        <Route path="kyc-report"                        element={<KYCReport />} />
        <Route path="cd-ratio-report"                   element={<CDRatioReport />} />
        <Route path="sms-report"                        element={<SMSReport />} />
        <Route path="si-report"                         element={<SIReport />} />
        <Route path="reports/account-open-close"        element={<AccountOpenCloseReport />} />
        <Route path="reports/branch-wise-deposit-loans" element={<BranchWiseDepositLoans />} />
        <Route path="inoperative-acc-list"              element={<InOperativeAccList />} />
        <Route path="daily-bal-less-than-clg"           element={<DailyBalLessThanClg />} />
        <Route path="tds-report"                        element={<TDSReport />} />
        <Route path="crr-slr-report"                    element={<CRRSLRReport />} />
        <Route path="crar-report"                       element={<CRARReport />} />

        {/* Restored monthly reporting routes */}
        <Route path="chairman-report" element={<ChairmanReport />} />
        <Route path="loan-against-fd" element={<LoanAgainstFD />} />
        <Route path="gold-loan-sanction" element={<GoldLoanSanction />} />
        <Route path="all-ok-report" element={<AllOkReport />} />
        <Route path="deposit-loan-statement" element={<DepositLoanStatement />} />
        <Route path="loan-summary" element={<LoanSummary />} />
        <Route path="loan-defaulter-list" element={<LoanDefaulterList />} />
        <Route path="rate-wise-deposit-loan" element={<RateWiseDepositLoan />} />
        <Route path="trial-balance" element={<TrialBalance />} />
      </Route>
    </Routes>
  )
}

export default App