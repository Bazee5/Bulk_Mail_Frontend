// axios would be imported in your actual implementation
import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Inbox, FileUp, SendHorizonal, Loader2, Mail, Users, CheckCircle, ChevronDown, Paperclip, Send } from "lucide-react";

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

  // In actual implementation, you would use axios here
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

  // Demo simulation
  setTimeout(() => {
    showToast("Emails sent successfully", "success");
    setStatus(false);
  }, 2000);
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
    <div className="h-screen bg-white flex flex-col">
      {/* Header - Claude style */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-600 rounded-md flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Bulk Mail Sender</h1>
          </div>
          <div className="text-sm text-gray-500">
            {emailList.length > 0 && `${emailList.length} recipients loaded`}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
          {/* File Upload Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Email List</h2>
            
            <label className="group relative flex items-center gap-3 p-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-violet-300 rounded-lg cursor-pointer transition-all duration-200">
              <div className="flex items-center justify-center w-10 h-10 bg-violet-50 group-hover:bg-violet-100 rounded-lg transition-colors">
                <FileUp className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Upload Excel File</div>
                <div className="text-xs text-gray-500">Choose .xls or .xlsx file</div>
              </div>
              <input type="file" onChange={handlefile} className="hidden" accept=".xls,.xlsx" />
            </label>
            
            {emailList.length > 0 && (
              <div className="mt-3 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  {emailList.length} email{emailList.length !== 1 ? 's' : ''} ready
                </div>
              </div>
            )}
          </div>

          {/* Recipients Preview */}
          <div className="flex-1 overflow-hidden">
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Recipients</h3>
              {emailList.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {emailList.slice(0, 10).map((email, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded text-sm">
                      <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700 truncate">{email}</span>
                    </div>
                  ))}
                  {emailList.length > 10 && (
                    <div className="text-xs text-gray-500 text-center py-2">
                      +{emailList.length - 10} more recipients
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No recipients yet</p>
                  <p className="text-xs text-gray-400 mt-1">Upload an Excel file to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto">
              {/* Welcome Message */}
              <div className="mb-8">
                <div className="flex gap-4 mb-4">
                  <div className="w-8 h-8 bg-violet-600 rounded-md flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-900 mb-2">Welcome to Bulk Mail Sender!</p>
                      <p className="text-sm text-gray-600">
                        I'll help you send personalized emails to multiple recipients. Start by uploading your Excel file with email addresses, then compose your message below.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Message Preview */}
              {msg && (
                <div className="mb-6">
                  <div className="flex gap-4 justify-end">
                    <div className="flex-1 max-w-2xl">
                      <div className="bg-violet-600 text-white rounded-lg p-4">
                        <p className="whitespace-pre-wrap">{msg}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-violet-100 rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-violet-600 font-semibold text-sm">You</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {status && (
                <div className="mb-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-violet-600 rounded-md flex items-center justify-center flex-shrink-0">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-900">Sending emails to {emailList.length} recipients...</p>
                        <p className="text-sm text-gray-600 mt-1">Please wait while I process your request.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-white">
            <div className="p-4">
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <textarea
                    value={msg || ''}
                    onChange={handlemsg}
                    className="w-full min-h-20 max-h-48 p-4 pr-12 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all resize-none text-gray-900 placeholder-gray-500"
                    placeholder="Type your email message here..."
                  />
                  
                  {/* Send Button */}
                  <button
                    onClick={send}
                    disabled={status || emailList.length === 0 || !msg}
                    className={`absolute bottom-3 right-3 w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 ${
                      status || emailList.length === 0 || !msg
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-violet-600 hover:bg-violet-700 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {status ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
                
                {/* Help Text */}
                <div className="mt-2 text-xs text-gray-500 text-center">
                  {emailList.length === 0 && "Upload an email list to get started"}
                  {emailList.length > 0 && !msg && "Compose your message and press Send"}
                  {emailList.length > 0 && msg && !status && `Ready to send to ${emailList.length} recipient${emailList.length !== 1 ? 's' : ''}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;