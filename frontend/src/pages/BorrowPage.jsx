import { useState } from 'react';
import { Wallet, Calendar, Shield } from 'lucide-react';

const BorrowPage = () => {
  const [formData, setFormData] = useState({
    amount: '',
    duration: 30,
    maxInterestRate: 5.8
  });

  const collateralRequired = parseFloat(formData.amount || 0) * 1.5; // 150% from contract

  const handleSubmit = () => {
    console.log('Submit loan request:', formData);
    // Call contract's requestLoan method
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 p-4 rounded-lg mt-8">
      {/* Amount Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <Wallet size={20} />
          <h2 className="text-lg font-semibold">Borrow Amount</h2>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-1 text-sm">
            <span>Amount (ETH)</span>
            <span>Available: {collateralRequired.toFixed(2)} ETH</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full bg-transparent text-lg outline-none"
              placeholder="0.00"
            />
            <button className="px-2 py-1 bg-blue-600 rounded text-sm">MAX</button>
          </div>
          <div className="mt-1 text-gray-400 text-sm">
            ≈ ${(parseFloat(formData.amount || 0) * 2500).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Loan Terms Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <Calendar size={20} />
          <h2 className="text-lg font-semibold">Loan Terms</h2>
        </div>
        <div className="space-y-3">
          <div className="bg-gray-800 p-3 rounded-lg">
            <label className="block mb-1 text-sm">Loan End Date</label>
            <input
              type="date"
              value={formData.duration}
              onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
              className="w-full bg-transparent text-base"
            />
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <label className="block mb-1 text-sm">Maximum Interest Rate</label>
            <div className="flex items-center">
              <input
                type="range"
                min="1"
                max="20"
                value={formData.maxInterestRate}
                onChange={(e) => setFormData((prev) => ({ ...prev, maxInterestRate: parseFloat(e.target.value) }))}
                className="flex-1 mr-3"
              />
              <span className="text-base">{formData.maxInterestRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collateral Info */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <Shield size={20} />
          <h2 className="text-lg font-semibold">Required Collateral</h2>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="flex justify-between mb-1 text-sm">
            <span>Collateral Amount</span>
            <span>{collateralRequired.toFixed(2)} ETH</span>
          </div>
          <div className="flex justify-between text-gray-400 text-sm">
            <span>Collateral Ratio</span>
            <span>150%</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-orange-600 rounded-lg font-semibold text-sm hover:bg-orange-700"
      >
        Create Loan Request
      </button>
    </div>
  );
};

export default BorrowPage;
