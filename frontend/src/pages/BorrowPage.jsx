import { useState, useEffect } from 'react';
import { Wallet, Calendar, Shield, Clock, ArrowRight, RefreshCcw, List } from 'lucide-react';
import { Wallet, Calendar, Shield } from 'lucide-react';
import { ethers } from 'ethers';
import LoanManagerABI from '../ABI/lendLink.json';

const LoanManagerAddress = import.meta.env.VITE_LEND_LINK_CONTRACT_ADDRESS;

const BorrowPage = () => {
  const [activeTab, setActiveTab] = useState('borrow');
  const [formData, setFormData] = useState({
    amount: '',
    endDate: '',
    maxInterestRate: 5.8
  });
  
  const [activeLoans, setActiveLoans] = useState([]);
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);

  const collateralRequired = parseFloat(formData.amount || 0) * 1.5; // 150% from contract

  // Calculate minimum date (today) and maximum date (1 year from today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.setFullYear(today.getFullYear() + 1)).toISOString().split('T')[0];

  // Calculate loan duration in days when endDate changes
  const calculateDuration = (endDate) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const start = new Date();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Mock function to get active loans - replace with actual contract call
  const fetchActiveLoans = async () => {
    // Simulated data - replace with contract calls
    setActiveLoans([
      {
        id: 1,
        amount: "2.5",
        collateral: "3.75",
        interestRate: "5.8",
        startDate: "2025-01-01",
        endDate: "2025-02-01",
        repaidAmount: "0.5",
        status: "active"
      },
    ]);
  };

  useEffect(() => {
    fetchActiveLoans();
  }, []);

  const handleSubmit = async () => {
    try {
      const duration = calculateDuration(formData.endDate);
      const requestData = {
        ...formData,
        duration,
      };
      console.log('Submit loan request:', requestData);
      // Call contract's requestLoan method with the duration
    } catch (error) {
      console.error('Error requesting loan:', error);
    }
  };

  const handleRepayment = async (loanId, amount, isFullRepayment = false) => {
    try {
      if (isFullRepayment) {
        // Call contract's repayLoan function
        console.log('Full repayment for loan:', loanId);
      } else {
        // Call contract's makePartialRepayment function
        console.log('Partial repayment for loan:', loanId, 'amount:', amount);
      }
    } catch (error) {
      console.error('Error processing repayment:', error);
    }
  };

  const LoanCard = ({ loan }) => (
    <div className="bg-gray-900 rounded-lg p-6 mb-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Loan #{loan.id}</h3>
        <p className="text-gray-400 text-sm">Started: {loan.startDate}</p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Amount:</span>
          <span>{loan.amount} ETH</span>
        </div>
        <div className="flex justify-between">
          <span>Collateral:</span>
          <span>{loan.collateral} ETH</span>
        </div>
        <div className="flex justify-between">
          <span>Interest Rate:</span>
          <span>{loan.interestRate}%</span>
        </div>
        <div className="flex justify-between">
          <span>End Date:</span>
          <span>{loan.endDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Repaid:</span>
          <span>{loan.repaidAmount} ETH</span>
        </div>
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => {
              setSelectedLoan(loan);
              setIsRepaymentModalOpen(true);
            }}
            className="flex-1 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700"
          >
            Partial Repayment
          </button>
          <button
            onClick={() => handleRepayment(loan.id, loan.amount, true)}
            className="flex-1 py-2 bg-green-600 rounded-lg text-sm hover:bg-green-700"
          >
            Repay Full Amount
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Custom Tabs */}
      <div className="flex mb-4 bg-gray-800 rounded-lg p-1">
        <button
          className={`flex-1 py-2 text-center rounded-md ${
            activeTab === 'borrow' ? 'bg-gray-700 text-white' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('borrow')}
        >
          New Loan Request
        </button>
        <button
          className={`flex-1 py-2 text-center rounded-md ${
            activeTab === 'active' ? 'bg-gray-700 text-white' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('active')}
        >
          Active Loans
        </button>
      </div>

      {activeTab === 'borrow' ? (
        <div className="bg-gray-900 rounded-lg p-6">
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
                  value={formData.endDate}
                  min={minDate}
                  max={maxDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full bg-transparent text-base p-2 border border-gray-700 rounded"
                />
                {formData.endDate && (
                  <div className="mt-2 text-sm text-gray-400">
                    Duration: {calculateDuration(formData.endDate)} days
                  </div>
                )}
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <label className="block mb-1 text-sm">Maximum Interest Rate</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={formData.maxInterestRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxInterestRate: parseFloat(e.target.value) }))}
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
      ) : (
        <div className="space-y-4">
          {activeLoans.map(loan => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      )}

      {/* Custom Modal */}
      {isRepaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Loan Repayment</h3>
              <p className="text-gray-400 text-sm">
                Enter the amount you want to repay for Loan #{selectedLoan?.id}
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm">Repayment Amount (ETH)</label>
                <input
                  type="number"
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(e.target.value)}
                  className="w-full p-2 bg-gray-800 rounded-lg"
                  placeholder="0.00"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsRepaymentModalOpen(false)}
                  className="flex-1 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleRepayment(selectedLoan?.id, repaymentAmount);
                    setIsRepaymentModalOpen(false);
                  }}
                  className="flex-1 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700"
                >
                  Confirm Repayment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    duration: 30,
    maxInterestRate: 5.8,
  });
  const [userLoans, setUserLoans] = useState([]);
  const [ethPrice, setEthPrice] = useState(0);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initializeContract = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const loanManagerContract = new ethers.Contract(LoanManagerAddress, LoanManagerABI, signer);
        setContract(loanManagerContract);

        // Fetch ETH price
        const price = await loanManagerContract.getETHPrice();
        setEthPrice(ethers.utils.formatUnits(price, 8)); // Assuming 8 decimals for price feed

        // Fetch user's loans
        const address = await signer.getAddress();
        const loans = await loanManagerContract.borrowerLoans(address);
        setUserLoans(loans);
      }
    };

    initializeContract();
  }, []);

  const collateralRequired = parseFloat(formData.amount || 0) * 1.5; // 150% from contract

  const handleSubmit = async () => {
    if (!contract) return;
    try {
      const tx = await contract.requestLoan(
        ethers.utils.parseEther(formData.amount),
        ethers.utils.parseUnits(formData.maxInterestRate.toString(), 2),
        formData.duration * 86400, // Convert days to seconds
        [], // Accepted collaterals (empty for now, using only ETH)
        { value: ethers.utils.parseEther(collateralRequired.toString()) }
      );
      await tx.wait();
      console.log('Loan request submitted');
      // Refresh user loans
      const address = await contract.signer.getAddress();
      const loans = await contract.borrowerLoans(address);
      setUserLoans(loans);
    } catch (error) {
      console.error('Error submitting loan request:', error);
    }
  };

  const handleRepayLoan = async (loanId, fullRepayment = false) => {
    if (!contract) return;
    try {
      let tx;
      if (fullRepayment) {
        tx = await contract.repayLoan(loanId);
      } else {
        const partialAmount = ethers.utils.parseEther("0.1");
        tx = await contract.makePartialRepayment(loanId, partialAmount);
      }
      await tx.wait();
      console.log(`Loan ${loanId} ${fullRepayment ? 'fully repaid' : 'partially repaid'}`);
      // Refresh user loans
      const address = await contract.signer.getAddress();
      const loans = await contract.borrowerLoans(address);
      setUserLoans(loans);
    } catch (error) {
      console.error('Error repaying loan:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 p-6 rounded-lg mt-8">
      <div className="card">
        <div className="card-header">
          <h2>Borrow</h2>
        </div>
        <div className="card-content">
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  className="w-full bg-transparent text-lg"
                  placeholder="0.00"
                />
                <button className="button-secondary sm">MAX</button>
              </div>
              <div className="mt-1 text-gray-400 text-sm">
                ≈ ${(parseFloat(formData.amount || 0) * parseFloat(ethPrice)).toFixed(2)}
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
                <label className="block mb-1 text-sm">Loan Duration (days)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: parseInt(e.target.value) }))}
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
                    step="0.1"
                    value={formData.maxInterestRate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, maxInterestRate: parseFloat(e.target.value) }))}
                    className="flex-1 mr-3"
                  />
                  <span className="text-base">{formData.maxInterestRate.toFixed(1)}%</span>
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
          <button onClick={handleSubmit} className="w-full button-primary">
            Create Loan Request
          </button>
        </div>
      </div>

      {/* User Loans Section */}
      <div className="card mt-6">
        <div className="card-header">
          <h2>Your Loans</h2>
        </div>
        <div className="card-content">
          {userLoans.length === 0 ? (
            <p>You have no active loans.</p>
          ) : (
            <ul className="space-y-4">
              {userLoans.map((loanId) => (
                <li key={loanId.toString()} className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>Loan #{loanId.toString()}</span>
                    <div>
                      <button
                        onClick={() => handleRepayLoan(loanId, false)}
                        className="button-outline sm mr-2"
                      >
                        Partial Repay
                      </button>
                      <button
                        onClick={() => handleRepayLoan(loanId, true)}
                        className="button-primary sm"
                      >
                        Full Repay
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowPage;