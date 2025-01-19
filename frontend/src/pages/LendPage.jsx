import React, { useState } from 'react';
import { 
  Shield, ArrowUpRight, AlertCircle, 
  Wallet, Clock, TrendingUp 
} from 'lucide-react';

// Mock data
const mockLoans = [
  {
    id: "1",
    borrower: "0x1234...5678",
    amount: "1000",
    collateral: "0.5",
    duration: "30",
    maxInterestRate: "12",
    collateralRatio: "150",
    status: "pending",
    created: "2024-01-15"
  },
  {
    id: "2",
    borrower: "0x8765...4321",
    amount: "2500",
    collateral: "1.2",
    duration: "60",
    maxInterestRate: "10",
    collateralRatio: "165",
    status: "pending",
    created: "2024-01-16"
  },
  {
    id: "3",
    borrower: "0x9876...1234",
    amount: "5000",
    collateral: "2.5",
    duration: "90",
    maxInterestRate: "8",
    collateralRatio: "175",
    status: "pending",
    created: "2024-01-17"
  }
];

const LendingPage = () => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = {
    totalLoans: mockLoans.length,
    totalValue: mockLoans.reduce((acc, loan) => acc + parseFloat(loan.amount), 0),
    avgInterestRate: (mockLoans.reduce((acc, loan) => acc + parseFloat(loan.maxInterestRate), 0) / mockLoans.length).toFixed(1),
    ethPrice: "2,245.50"
  };

  const handleOpenModal = (loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Lending Dashboard</h1>
            <button className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Available Loans", value: stats.totalLoans },
              { label: "Total Value", value: `$${stats.totalValue.toLocaleString()}` },
              { label: "Avg Interest Rate", value: `${stats.avgInterestRate}%` },
              { label: "ETH Price", value: `$${stats.ethPrice}` }
            ].map((stat, index) => (
              <div key={index} className="bg-[#1F2937] p-6 rounded-lg border border-[#374151]">
                <h3 className="text-lg text-gray-400 mb-2">{stat.label}</h3>
                <p className="text-3xl font-bold text-blue-400">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex gap-4 mb-8">
          {['all', 'high_yield', 'safe'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterStatus(filter)}
              className={`px-4 py-2 rounded-md transition-colors ${
                filterStatus === filter 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-[#1F2937] text-gray-300 hover:bg-[#374151]'
              }`}
            >
              {filter.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Loans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockLoans.map((loan) => (
            <div 
              key={loan.id} 
              className="bg-[#1F2937] rounded-lg border border-[#374151] hover:bg-[#252F3F] transition-colors"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {parseFloat(loan.amount).toLocaleString()} LINK
                    </h3>
                    <p className="text-gray-400">
                      Collateral: {loan.collateral} ETH
                    </p>
                  </div>
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#374151] p-3 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Duration</div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-400" />
                        {loan.duration} Days
                      </div>
                    </div>
                    <div className="bg-[#374151] p-3 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Interest</div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-blue-400" />
                        {loan.maxInterestRate}% APR
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="text-sm text-gray-400 mb-2">Collateral Ratio</div>
                    <div className="w-full bg-[#374151] rounded-full h-2">
                      <div 
                        className="bg-blue-500 rounded-full h-2" 
                        style={{ width: `${loan.collateralRatio - 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-400 mt-1 text-right">
                      {loan.collateralRatio}%
                    </div>
                  </div>
                  
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors flex items-center justify-center"
                    onClick={() => handleOpenModal(loan)}
                  >
                    Fund Loan
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#1F2937] rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Fund Loan #{selectedLoan.id}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Amount to Fund</span>
                <span>{selectedLoan.amount} LINK</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Collateral</span>
                <span>{selectedLoan.collateral} ETH</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Interest Rate</span>
                <span>{selectedLoan.maxInterestRate}% APR</span>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 mr-3 mt-0.5 text-blue-400" />
                <div>
                  <h4 className="font-medium mb-1">Information</h4>
                  <p className="text-sm text-gray-300">
                    Make sure you have enough LINK tokens in your wallet before funding.
                  </p>
                </div>
              </div>

              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                onClick={() => {
                  console.log('Funding loan:', selectedLoan.id);
                  setIsModalOpen(false);
                }}
              >
                Confirm Funding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LendingPage;