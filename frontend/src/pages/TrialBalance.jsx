// import { useState } from "react";
// import "./TrialBalance.css";

// function TrialBalance() {
//   const [form, setForm] = useState({
//     reportType: "Details Wise",
//     dateType: "AsOnDate",
//     branchCode: "1",
//     toDate: "30/03/2026",
//     fromDate: "",
//     sortType: "Code Wise",
//     textReportName: ""
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const isFromTo = form.dateType === "FromTo";

//   return (
//     <div className="tb-wrapper">
//       <div className="tb-card">

//         {/* HEADER */}
//         <div className="tb-header">Trail Balance Report</div>

//         {/* TOP RADIO SECTION — two separate groups on one row */}
//         <div className="tb-radio-section">
//           <div className="tb-radio-row">

//             {/* GROUP 1 — report type */}
//             {["Details Wise", "Summary Wise"].map((opt) => (
//               <label key={opt} className="tb-radio-label">
//                 <input type="radio" name="reportType" value={opt}
//                   checked={form.reportType === opt} onChange={handleChange} />
//                 {opt}
//               </label>
//             ))}

//             <div className="tb-radio-divider" />

//             {/* GROUP 2 — date type */}
//             {["AsOnDate", "FromTo"].map((opt) => (
//               <label key={opt} className="tb-radio-label">
//                 <input type="radio" name="dateType" value={opt}
//                   checked={form.dateType === opt} onChange={handleChange} />
//                 {opt}
//               </label>
//             ))}

//           </div>
//         </div>

//         {/* FIELDS SECTION */}
//         <div className="tb-fields-section">

//           {/* BRANCH CODE + TO DATE (always visible) */}
//           <div className="tb-fields-row">
//             <div className="tb-field">
//               <label>Branch Code <span className="req">*</span></label>
//               <input className="tb-input" name="branchCode"
//                 value={form.branchCode} onChange={handleChange} />
//             </div>
//             <div className="tb-field">
//               <label>{isFromTo ? "To Date" : "To Date"} <span className="req">*</span></label>
//               <input className="tb-input" name="toDate"
//                 value={form.toDate} onChange={handleChange} />
//             </div>
//           </div>

//           {/* FROM DATE — only when FromTo is selected */}
//           {isFromTo && (
//             <div className="tb-fields-row">
//               <div className="tb-field">
//                 <label>From Date <span className="req">*</span></label>
//                 <input className="tb-input" name="fromDate"
//                   placeholder="dd/mm/yyyy"
//                   value={form.fromDate} onChange={handleChange} />
//               </div>
//             </div>
//           )}

//           {/* SORT TYPE RADIOS */}
//           <div className="tb-inline-radio-row">
//             {["Code Wise", "Name Wise"].map((opt) => (
//               <label key={opt} className="tb-radio-label">
//                 <input type="radio" name="sortType" value={opt}
//                   checked={form.sortType === opt} onChange={handleChange} />
//                 {opt}
//               </label>
//             ))}
//           </div>

//           {/* TEXT REPORT NAME */}
//           <div className="tb-field tb-field-full">
//             <label>Please enter text report name <span className="req">*</span></label>
//             <input className="tb-input tb-input-wide" name="textReportName"
//               placeholder="Please enter text report name"
//               value={form.textReportName} onChange={handleChange} />
//           </div>

//         </div>

//         {/* FOOTER BUTTONS */}
//         <div className="tb-footer">
//           {["Submit", "Lazer", "Text", "Text Report View", "TB Format1"].map((btn) => (
//             <button key={btn} className="tb-btn" onClick={() => alert(btn)}>
//               {btn}
//             </button>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default TrialBalance;

import { useState } from "react";
import "./TrialBalance.css";

function TrialBalance() {
  const [form, setForm] = useState({
    reportType: "Details Wise",
    branchCode: "1",
    toDate: "30/03/2026",
    fromDate: "",
    sortType: "Code Wise",
    textReportName: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFromTo = form.reportType === "FromTo";

  return (
    <div className="tb-wrapper">
      <div className="tb-card">

        {/* HEADER */}
        <div className="tb-header">Trail Balance Report</div>

        {/* TOP RADIO SECTION — all 4 in one group */}
        <div className="tb-radio-section">
          <div className="tb-radio-row">
            {["Details Wise", "Summary Wise", "AsOnDate", "FromTo"].map((opt) => (
              <label key={opt} className="tb-radio-label">
                <input type="radio" name="reportType" value={opt}
                  checked={form.reportType === opt} onChange={handleChange} />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* FIELDS SECTION */}
        <div className="tb-fields-section">

          {/* BRANCH CODE + TO DATE + FROM DATE (if FromTo) */}
          <div className="tb-fields-row">
            <div className="tb-field">
              <label>Branch Code <span className="req">*</span></label>
              <input className="tb-input" name="branchCode"
                value={form.branchCode} onChange={handleChange} />
            </div>
            <div className="tb-field">
              <label>To Date <span className="req">*</span></label>
              <input className="tb-input" name="toDate"
                value={form.toDate} onChange={handleChange} />
            </div>
            {isFromTo && (
              <div className="tb-field">
                <label>From Date <span className="req">*</span></label>
                <input className="tb-input" name="fromDate"
                  placeholder="dd/mm/yyyy"
                  value={form.fromDate} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* SORT TYPE RADIOS */}
          <div className="tb-inline-radio-row">
            {["Code Wise", "Name Wise"].map((opt) => (
              <label key={opt} className="tb-radio-label">
                <input type="radio" name="sortType" value={opt}
                  checked={form.sortType === opt} onChange={handleChange} />
                {opt}
              </label>
            ))}
          </div>

          {/* TEXT REPORT NAME */}
          <div className="tb-field tb-field-full">
            <label>Please enter text report name <span className="req">*</span></label>
            <input className="tb-input tb-input-wide" name="textReportName"
              placeholder="Please enter text report name"
              value={form.textReportName} onChange={handleChange} />
          </div>

        </div>

        {/* FOOTER BUTTONS */}
        <div className="tb-footer">
          {["Submit", "Lazer", "Text", "Text Report View", "TB Format1"].map((btn) => (
            <button key={btn} className="tb-btn" onClick={() => alert(btn)}>
              {btn}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default TrialBalance;