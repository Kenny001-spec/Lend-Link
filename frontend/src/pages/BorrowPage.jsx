import { useState } from 'react';
import { Wallet, Calendar, Shield, AlertTriangle, Info, DollarSign, Activity } from 'lucide-react';

const BorrowPage = () => {
  const [formData, setFormData] = useState({
    amount: '',
    duration: 30,
    maxInterestRate: 5.8,
    selectedCollateral: 'ETH',
  });

  const [marketStats, setMarketStats] = useState({
    totalLiquidity: '1,234.56',
    avgInterestRate: '6.2',
    activeLoans: '45',
    availableToBorrow: '567.89',
  });

  const [userStats, setUserStats] = useState({
    activeLoans: [],
    totalBorrowed: '0',
    totalCollateral: '0',
    healthFactor: '0',
  });

  const collateralRequired = parseFloat(formData.amount || 0) * 1.5; // 150% from contract
  const estimatedInterest =
    (parseFloat(formData.amount || 0) * (formData.maxInterestRate / 100)) * (formData.duration / 365);
  const totalRepayment = parseFloat(formData.amount || 0) + estimatedInterest;

  const handleSubmit = () => {
    console.log('Submit loan request:', formData);
    // Call contract's requestLoan method
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Market Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: 'Total Liquidity', value: `$${marketStats.totalLiquidity}`, color: 'text-blue-400' },
          { icon: Activity, label: 'Avg. Interest Rate', value: `${marketStats.avgInterestRate}%`, color: 'text-green-400' },
          { icon: Info, label: 'Active Loans', value: marketStats.activeLoans, color: 'text-purple-400' },
          { icon: Wallet, label: 'Available to Borrow', value: `$${marketStats.availableToBorrow}`, color: 'text-orange-400' },
        ].map((stat, index) => (
          <div key={index} className="p-4 bg-gray-900 rounded-md">
            <div className="flex items-center space-x-2">
              <stat.icon size={20} className={stat.color} />
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Borrow Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Risk Warning */}
          <div className="p-4 bg-red-900/50 border border-red-800 rounded-md flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-white">
              Borrowing assets involves risk of liquidation. Please ensure you understand how collateralization works.
            </p>
          </div>

          {/* Amount Section */}
          <div className="p-4 bg-gray-900 rounded-md">
            <h3 className="flex items-center space-x-2 mb-3">
              <Wallet size={20} />
              <span className="text-lg font-semibold">Borrow Amount</span>
            </h3>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Amount (LINK)</span>
                <span>Available: {marketStats.availableToBorrow} LINK</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  className="flex-1 bg-transparent text-lg outline-none"
                  placeholder="0.00"
                />
                <button className="px-2 py-1 bg-blue-600 text-sm rounded">MAX</button>
              </div>
              <div className="text-sm text-gray-400 mt-1">
                ≈ ${(parseFloat(formData.amount || 0) * 18.5).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Loan Terms */}
          <div className="p-4 bg-gray-900 rounded-md">
            <h3 className="flex items-center space-x-2 mb-3">
              <Calendar size={20} />
              <span className="text-lg font-semibold">Loan Terms</span>
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <label className="block mb-1 text-sm">Duration (Days)</label>
                <select
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value),
                    }))
                  }
                  className="w-full bg-transparent border border-gray-700 rounded p-2"
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <label className="block mb-1 text-sm">Maximum Interest Rate</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={formData.maxInterestRate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxInterestRate: parseFloat(e.target.value),
                      }))
                    }
                    className="flex-1"
                  />
                  <span className="ml-3">{formData.maxInterestRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Collateral Section */}
          <div className="p-4 bg-gray-900 rounded-md">
            <h3 className="flex items-center space-x-2 mb-3">
              <Shield size={20} />
              <span className="text-lg font-semibold">Collateral</span>
            </h3>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Required Collateral</span>
                <span>{collateralRequired.toFixed(2)} ETH</span>
              </div>
              <p className="text-sm text-gray-400">Collateral Ratio: 150%</p>
              <p className="text-sm text-gray-400">Liquidation Threshold: 110%</p>
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Stats */}
        <div className="space-y-6">
          {/* Loan Summary */}
          <div className="p-4 bg-gray-900 rounded-md">
            <h3 className="mb-3">Loan Summary</h3>
            <div className="space-y-2">
              {[
                { label: 'Borrow Amount', value: `${formData.amount || 0} LINK` },
                { label: 'Duration', value: `${formData.duration} days `},
                { label: 'Interest Rate', value: `${formData.maxInterestRate}%` },
                { label: 'Estimated Interest', value: `${estimatedInterest.toFixed(2)} LINK` },
                { label: 'Required Collateral', value: `${collateralRequired.toFixed(2)} ETH` },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm text-gray-400"
                >
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-3 mt-3 flex justify-between font-semibold">
              <span>Total Repayment</span>
              <span>{totalRepayment.toFixed(2)} LINK</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-orange-600 rounded-lg font-semibold hover:bg-orange-700"
          >
            Create Loan Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowPage;