import React, { useState } from 'react';
import { Calculator, Zap, Droplet, Wifi, Users, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

export default function BillCalculator() {
  const [step, setStep] = useState(1);
  const [users] = useState(['Tuhin', 'Kartic', 'Hamza', 'Sohag']);
  const [month] = useState('October');
  const [eBillRef] = useState(800);
  const [wifiBill] = useState(740);
  
  const [eBillTotal, setEBillTotal] = useState('');
  const [wBillTotal, setWBillTotal] = useState('');
  const [extraUsers, setExtraUsers] = useState([]);
  const [wifiPayers, setWifiPayers] = useState([]);
  const [divisions, setDivisions] = useState('');
  const [userDivisions, setUserDivisions] = useState({});
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [tempDivision, setTempDivision] = useState('');
  const [error, setError] = useState('');

  const resetCalculator = () => {
    setStep(1);
    setEBillTotal('');
    setWBillTotal('');
    setExtraUsers([]);
    setWifiPayers([]);
    setDivisions('');
    setUserDivisions({});
    setCurrentUserIndex(0);
    setTempDivision('');
    setError('');
  };

  const handleExtraUserToggle = (user) => {
    setExtraUsers(prev => 
      prev.includes(user) ? prev.filter(u => u !== user) : [...prev, user]
    );
  };

  const handleWifiPayerToggle = (user) => {
    setWifiPayers(prev => 
      prev.includes(user) ? prev.filter(u => u !== user) : [...prev, user]
    );
  };

  const handleDivisionSubmit = () => {
    const divValue = parseInt(tempDivision);
    if (isNaN(divValue) || divValue < 0) {
      setError('Please enter a valid positive number.');
      return;
    }

    const totalAssigned = Object.values(userDivisions).reduce((a, b) => a + b, 0);
    const maxDivisions = parseInt(divisions);

    if (totalAssigned + divValue > maxDivisions) {
      setError(`Exceeds maximum ${maxDivisions} divisions! Remaining: ${maxDivisions - totalAssigned}`);
      return;
    }

    const currentUser = extraUsers[currentUserIndex];
    setUserDivisions(prev => ({ ...prev, [currentUser]: divValue }));
    setTempDivision('');
    setError('');
    
    if (currentUserIndex < extraUsers.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
    } else {
      setStep(5);
    }
  };

  const calculateBills = () => {
    const nPpl = users.length;
    const eBillPrsn = eBillRef / nPpl;
    const wBillPrsn = parseFloat(wBillTotal) / nPpl;
    const wifiPerPayer = wifiPayers.length > 0 ? wifiBill / wifiPayers.length : 0;
    
    const eBillExtra = parseFloat(eBillTotal) - eBillRef;
    const divValue = eBillExtra > 0 && divisions ? eBillExtra / parseInt(divisions) : 0;

    const bills = {};
    users.forEach(user => {
      let total = eBillPrsn + wBillPrsn;
      
      if (userDivisions[user]) {
        total += userDivisions[user] * divValue;
      }
      
      if (wifiPayers.includes(user)) {
        total += wifiPerPayer;
      }
      
      bills[user] = total;
    });

    return {
      bills,
      eBillPrsn,
      wBillPrsn,
      wifiPerPayer,
      eBillExtra,
      divValue,
      grandTotal: Object.values(bills).reduce((a, b) => a + b, 0)
    };
  };

  const results = step === 5 ? calculateBills() : null;

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-2xl font-bold mb-2">Electricity Bill</h2>
              <p className="text-gray-600">Reference bill: ₹{eBillRef}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Enter Total Electricity Bill</label>
              <input
                type="number"
                value={eBillTotal}
                onChange={(e) => setEBillTotal(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>

            {parseFloat(eBillTotal) > eBillRef && (
              <div>
                <label className="block text-sm font-medium mb-3">Who used extra electricity?</label>
                <div className="grid grid-cols-2 gap-3">
                  {users.map(user => (
                    <button
                      key={user}
                      onClick={() => handleExtraUserToggle(user)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        extraUsers.includes(user)
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {extraUsers.includes(user) && <CheckCircle className="w-4 h-4 inline mr-2" />}
                      {user}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (!eBillTotal || parseFloat(eBillTotal) < 0) {
                  setError('Please enter a valid electricity bill.');
                  return;
                }
                if (parseFloat(eBillTotal) > eBillRef && extraUsers.length === 0) {
                  setError('Please select who used extra electricity.');
                  return;
                }
                setError('');
                setStep(2);
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Next →
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Droplet className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h2 className="text-2xl font-bold mb-2">Water Bill</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Enter Total Water Bill</label>
              <input
                type="number"
                value={wBillTotal}
                onChange={(e) => setWBillTotal(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  if (!wBillTotal || parseFloat(wBillTotal) < 0) {
                    setError('Please enter a valid water bill.');
                    return;
                  }
                  setError('');
                  setStep(3);
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Next →
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Wifi className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">WiFi Bill</h2>
              <p className="text-gray-600">Total bill: ₹{wifiBill}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Who will pay for WiFi?</label>
              <div className="grid grid-cols-2 gap-3">
                {users.map(user => (
                  <button
                    key={user}
                    onClick={() => handleWifiPayerToggle(user)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      wifiPayers.includes(user)
                        ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {wifiPayers.includes(user) && <CheckCircle className="w-4 h-4 inline mr-2" />}
                    {user}
                  </button>
                ))}
              </div>
              {wifiPayers.length > 0 && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Each payer: ₹{(wifiBill / wifiPayers.length).toFixed(2)}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  if (wifiPayers.length === 0) {
                    setError('Please select at least one WiFi payer.');
                    return;
                  }
                  setError('');
                  if (extraUsers.length > 0) {
                    setStep(4);
                  } else {
                    setStep(5);
                  }
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Next →
              </button>
            </div>
          </div>
        );

      case 4:
        const eBillExtra = parseFloat(eBillTotal) - eBillRef;
        const isLastUser = currentUserIndex === extraUsers.length - 1;
        const totalAssigned = Object.values(userDivisions).reduce((a, b) => a + b, 0);
        const remaining = parseInt(divisions) - totalAssigned;

        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-purple-500" />
              <h2 className="text-2xl font-bold mb-2">Extra Bill Distribution</h2>
              <p className="text-gray-600">Extra amount: ₹{eBillExtra.toFixed(2)}</p>
            </div>

            {!divisions ? (
              <div>
                <label className="block text-sm font-medium mb-2">How many divisions for extra bill?</label>
                <input
                  type="number"
                  value={divisions}
                  onChange={(e) => setDivisions(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter number of divisions"
                />
              </div>
            ) : (
              <div>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-700">User {currentUserIndex + 1} of {extraUsers.length}</p>
                  <p className="text-lg font-bold text-blue-700">{extraUsers[currentUserIndex]}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Per division: ₹{(eBillExtra / parseInt(divisions)).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Remaining divisions: {remaining}</p>
                </div>

                {isLastUser ? (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-green-800 font-medium">
                      {extraUsers[currentUserIndex]} gets the remaining {remaining} divisions.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Divisions for {extraUsers[currentUserIndex]}?
                    </label>
                    <input
                      type="number"
                      value={tempDivision}
                      onChange={(e) => setTempDivision(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter divisions"
                      max={remaining}
                    />
                  </div>
                )}

                <button
                  onClick={isLastUser ? () => {
                    setUserDivisions(prev => ({ ...prev, [extraUsers[currentUserIndex]]: remaining }));
                    setStep(5);
                  } : handleDivisionSubmit}
                  className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {isLastUser ? 'Calculate & View Summary →' : 'Next User →'}
                </button>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Calculator className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
              <h2 className="text-3xl font-bold mb-2">Bill Summary</h2>
              <p className="text-gray-600">{month}, 2025</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                <p className="text-xs text-gray-600">Electricity</p>
                <p className="text-lg font-bold text-yellow-700">₹{parseFloat(eBillTotal).toFixed(2)}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Droplet className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-xs text-gray-600">Water</p>
                <p className="text-lg font-bold text-blue-700">₹{parseFloat(wBillTotal).toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Wifi className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-xs text-gray-600">WiFi</p>
                <p className="text-lg font-bold text-green-700">₹{wifiBill.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-gray-700 mb-3">Breakdown</h3>
              <div className="flex justify-between text-sm"><span>Base Electricity (per person):</span><span className="font-medium">₹{results.eBillPrsn.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span>Water Bill (per person):</span><span className="font-medium">₹{results.wBillPrsn.toFixed(2)}</span></div>
              {wifiPayers.length > 0 && (<div className="flex justify-between text-sm"><span>WiFi (per payer):</span><span className="font-medium">₹{results.wifiPerPayer.toFixed(2)}</span></div>)}
              {results.eBillExtra > 0 && (<div className="flex justify-between text-sm"><span>Extra Electricity (per division):</span><span className="font-medium">₹{results.divValue.toFixed(2)}</span></div>)}
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center"><Users className="w-5 h-5 mr-2" />Individual Bills</h3>
              {users.map(user => (
                <div key={user} className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">{user}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {extraUsers.includes(user) && (<span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">⚡ Extra ({userDivisions[user]} div)</span>)}
                        {wifiPayers.includes(user) && (<span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">📡 WiFi</span>)}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">₹{results.bills[user].toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">Grand Total</p>
                  <p className="text-3xl font-bold">₹{results.grandTotal.toFixed(2)}</p>
                </div>
                <CheckCircle className="w-12 h-12" />
              </div>
              <p className="text-xs opacity-90 mt-2">
                Expected: ₹{(parseFloat(eBillTotal) + parseFloat(wBillTotal) + wifiBill).toFixed(2)}
              </p>
            </div>

            <button
              onClick={resetCalculator}
              className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Calculate New Bills
            </button>
          </div>
        );

      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-sans">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Monthly Bill Calculator</h1>
            <p className="text-gray-500 mt-2">Split bills fairly among roommates</p>
          </div>

          {step < 5 && (
            <div className="mb-6">
              <div className="flex justify-between mb-2 text-xs font-medium text-gray-400">
                {['Electricity', 'Water', 'WiFi', 'Division', 'Summary'].slice(0, 4).map((label, idx) => (
                  <span key={idx} className={`${step > idx ? 'text-blue-600' : ''}`}>
                    {label}
                  </span>
                ))}
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500 ease-out"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md relative mb-4" role="alert">
              <div className="flex">
                <div className="py-1"><AlertCircle className="h-6 w-6 text-red-500 mr-4"/></div>
                <div>
                  <p className="font-bold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}

