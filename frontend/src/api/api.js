// src/api/api.js
// Central API configuration and helper functions

const BASE_URL = "https://cbsapi.avsinsotech.com:8596";

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