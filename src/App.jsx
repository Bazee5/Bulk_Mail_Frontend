// axios would be imported in your actual implementation
import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Inbox, FileUp, SendHorizonal, Loader2, Mail, Users, CheckCircle, ChevronDown } from "lucide-react";

function App() {
  const [msg, setMsg] = useState();
  const [status, setStatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  function handlemsg(e) {
    setMsg(e.target.value);
  }

  function handlefile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetname = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetname];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalemail = emailList.map((item) => item.A);
      setEmailList(totalemail);
      showToast("Email list uploaded successfully", "success");
    };

    reader.readAsBinaryString(file);
  }

 function send() {
  setStatus(true);

  axios.post(`${import.meta.env.VITE_BACKEND_URL}/sendemail`, {
    msg: msg,
    emailList: emailList,
  })
  .then((data) => {
    if (data.data === true) {
      showToast("Emails sent successfully", "success");
      setStatus(false);
    } else {
      showToast("Failed to send emails", "error");
    }
  })
  .catch((err) => {
    showToast("Server error. Please try again", "error");
    setStatus(false);
  });
}


  const showToast = (message, type) => {
    // Simple toast implementation using state
    const toastEl = document.createElement('div');
    toastEl.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toastEl.textContent = message;
    document.body.appendChild(toastEl);
    
    setTimeout(() => {
      toastEl.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(toastEl), 300);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-purple-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Bulk Mail Sender</h1>
          </div>
          <p className="text-slate-600 text-lg">Send personalized emails to multiple recipients efficiently</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          
          {/* Step 1: File Upload */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                <span className="text-purple-600 font-semibold text-sm">1</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Upload Email List</h2>
            </div>
            
            <div className="space-y-4">
              <label className="group relative flex items-center gap-4 p-6 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:border-purple-400 rounded-lg cursor-pointer transition-all duration-200">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-colors">
                  <FileUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-slate-900 font-medium">Select Excel File</div>
                  <div className="text-sm text-slate-500">Upload .xls or .xlsx file containing email addresses</div>
                </div>
                <input type="file" onChange={handlefile} className="hidden" accept=".xls,.xlsx" />
              </label>
              
              {emailList.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="text-green-800 font-medium">
                      {emailList.length} email{emailList.length !== 1 ? 's' : ''} detected
                    </div>
                    <div className="text-sm text-green-700">Ready to send bulk emails</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Compose Message */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                <span className="text-purple-600 font-semibold text-sm">2</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Compose Message</h2>
            </div>
            
            <textarea
              onChange={handlemsg}
              className="w-full h-48 p-4 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none text-slate-900 placeholder-slate-500"
              placeholder="Type your email message here..."
            />
          </div>

          {/* Step 3: Send */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                <span className="text-purple-600 font-semibold text-sm">3</span>
              </div>
              <h2 className="text-xl font-semibold text-purple-900">Send Emails</h2>
            </div>
            
            <button
              onClick={send}
              disabled={status || emailList.length === 0 || !msg}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                status || emailList.length === 0 || !msg
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 active:bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-xl"
              }`}
            >
              {status ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Emails...
                </>
              ) : (
                <>
                  <SendHorizonal className="w-5 h-5" />
                  Send to {emailList.length} Recipient{emailList.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
            
            {emailList.length === 0 && (
              <p className="text-center text-slate-500 mt-3 text-sm">
                Please upload an email list to continue
              </p>
            )}
            
            {emailList.length > 0 && !msg && (
              <p className="text-center text-slate-500 mt-3 text-sm">
                Please compose your message to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
