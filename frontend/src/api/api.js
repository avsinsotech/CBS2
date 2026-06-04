// src/api/api.js
// Central API configuration and helper functions

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Generic fetch helper with error handling
const apiFetch = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.details || 'API request failed');
  }
  return data;
};

// Format date from YYYY-MM-DD (input[type=date]) to API format
export const formatDateForAPI = (dateStr) => {
  if (!dateStr) return '';
  return dateStr; // already YYYY-MM-DD from date input
};

// ─── LOAN & DEPOSIT REGISTER ───────────────────────────────────────────────
// Calls: GET /api/loan-depo-reg?flag=&subglcode=&brcd=&tdate=
export const fetchLoanDepoReg = ({ flag, subglcode, brcd, tdate }) => {
  const params = new URLSearchParams({ flag, subglcode, brcd, tdate });
  return apiFetch(`${BASE_URL}/api/loan-depo-reg?${params}`);
};

// ─── CUT BOOK (Closing) ─────────────────────────────────────────────────────
// Calls: GET /api/closing?brcd=&gl=&fromDate=&toDate=
export const fetchCutBook = ({ brcd, gl, fromDate, toDate }) => {
  const params = new URLSearchParams({ brcd, gl, fromDate, toDate });
  return apiFetch(`${BASE_URL}/api/closing?${params}`);
};

// ─── CUT BOOK DETAILS (RptCuteBookDetails_SUM) ──────────────────────────────
// Calls: GET /api/cute-book-details?brcd=&subglcode=&fromDate=&toDate=&custtype=&acctype=&flag=&amount=
export const fetchCuteBookDetails = ({
  brcd,
  subglcode = '',
  fromDate,
  toDate,
  custtype = '0',
  acctype = '0',
  flag = '',
  amount = '',
}) => {
  const params = new URLSearchParams({
    brcd,
    subglcode,
    fromDate,
    toDate,
    custtype,
    acctype,
    flag,
    ...(amount !== '' && { amount }),
  });
  return apiFetch(`${BASE_URL}/api/cute-book-details?${params}`);
};

// ─── SMS MASTER REPORT ───────────────────────────────────────────────────────
// Calls: GET /api/sms-master-report?fdate=&tdate=&fbrcd=&tbrcd=&mobile=
// mobile = '0' → All customers | actual number → Specific customer
export const fetchSMSMasterReport = ({ fdate, tdate, fbrcd, tbrcd, mobile = '0' }) => {
  const params = new URLSearchParams({ fdate, tdate, fbrcd, tbrcd, mobile });
  return apiFetch(`${BASE_URL}/api/sms-master-report?${params}`);
};

// ─── 15-GH SUBMIT REPORT ─────────────────────────────────────────────────────
// Calls: GET /api/15gh-submit-report
// mode: 'json' (default) | 'text' (plain-text new tab)
export const fetch15GHSubmitReport = ({ fromDate, toDate, fromCustNo = '1', toCustNo = '999999999', brcd = '', mode = 'json' }) => {
  const params = new URLSearchParams({ fromDate, toDate, fromCustNo, toCustNo, brcd, mode });
  return apiFetch(`${BASE_URL}/api/15gh-submit-report?${params}`);
};

// ─── CTR RISK CATEGORY UPDATE ────────────────────────────────────────────────
// Calls: POST /api/ctr-report/risk-category-update
export const updateCtrRiskCategory = ({ fromBrcd, toBrcd, fromDate, toDate, fromAmount, flag = 'UPDATE', mid = '2' }) => {
  return fetch(`${BASE_URL}/api/ctr-report/risk-category-update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fromBrcd, toBrcd, fromDate, toDate, fromAmount, flag, mid }),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.details || 'API request failed');
    }
    return data;
  });
};

// ─── CTR LIMIT REPORT ────────────────────────────────────────────────────────
// Calls: POST /api/ctr-report/limit-report
export const fetchCtrLimitReport = ({ fromBrcd, toBrcd, fromDate, toDate, fromAmount }) => {
  return fetch(`${BASE_URL}/api/ctr-report/limit-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fromBrcd, toBrcd, fromDate, toDate, fromAmount }),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.details || 'API request failed');
    }
    return data;
  });
};

// ─── CTR CREDIT/DEBIT REPORT ──────────────────────────────────────────────────
// Calls: POST /api/ctr-report/general-report
export const fetchCtrGeneralReport = ({ brcd, flag, fromDate, toDate, fsgl, tsgl, ctrLimit }) => {
  return fetch(`${BASE_URL}/api/ctr-report/general-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ brcd, flag, fromDate, toDate, fsgl, tsgl, ctrLimit }),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.details || 'API request failed');
    }
    return data;
  });
};

// ─── KYC REPORT ──────────────────────────────────────────────────────────────
// Calls: POST /api/kyc-report
export const fetchKycReport = ({ flag, tDate, fDate, fBrcd, tBrcd }) => {
  return fetch(`${BASE_URL}/api/kyc-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ flag, tDate, fDate, fBrcd, tBrcd }),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.details || 'API request failed');
    }
    return data;
  });
};

// ─── CD RATIO REPORT ─────────────────────────────────────────────────────────
// Calls: POST /api/cd-ratio-report
export const fetchCdRatioReport = ({ flag, brcd, onDate, flag1 }) => {
  return fetch(`${BASE_URL}/api/cd-ratio-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ flag, brcd, onDate, flag1 }),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.details || 'API request failed');
    }
    return data;
  });
};

// ─── STANDING INSTRUCTION (SI) REPORT ─────────────────────────────────────────
// Calls: POST /api/si-report
export const fetchSiReport = ({ flag, brcd, fromDate, toDate }) => {
  return fetch(`${BASE_URL}/api/si-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ flag, brcd, fromDate, toDate }),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.details || 'API request failed');
    }
    return data;
  });
};

// ─── ACCOUNT OPEN CLOSE REPORT ───────────────────────────────────────────────
// Calls: POST /api/account-open-close/report
export const fetchAccountOpenCloseReport = ({ flag, fbrcd, tbrcd, fromDate, toDate, subgl, tsubgl }) => {
  return fetch(`${BASE_URL}/api/account-open-close/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ flag, fbrcd, tbrcd, fromDate, toDate, subgl, tsubgl }),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.details || 'API request failed');
    }
    return data;
  });
};// ─── BRANCH WISE DEPOSIT / LOANS REPORT ─────────────────────────────────────────
// Calls: POST /api/branchwise-deposit-loans/report
export const fetchBranchWiseDepositLoans = ({ productType, unit, branchCode, asOnDate }) => {
  return fetch(`${BASE_URL}/api/branchwise-deposit-loans/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productType, unit, branchCode, asOnDate }),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.details || 'API request failed');
    }
    return data;
  });
};

// ─── DAILY BALANCE LESS THAN CLOSING BAL REPORT ─────────────────────────────────────
// Calls: POST /api/daily-balance-less-than-clg/report
export const fetchDailyBalLessThanClg = ({ branchID, asOnDate, productCode, periodMM }) => {
  return fetch(`${BASE_URL}/api/daily-balance-less-than-clg/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ branchID, asOnDate, productCode, periodMM }),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.details || 'API request failed');
    }
    return data;
  });
};

// ─── TDS DETAILS REPORT ─────────────────────────────────────────────────────────────
// Calls: POST /api/tds-report/report
export const fetchTdsReport = ({ fromDate, toDate, branchCode, fromCustNo, toCustNo, amount, flag }) => {
  return fetch(`${BASE_URL}/api/tds-report/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fromDate, toDate, branchCode, fromCustNo, toCustNo, amount, flag }),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.details || 'API request failed');
    }
    return data;
  });
};