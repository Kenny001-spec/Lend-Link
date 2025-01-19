import { useState, useEffect } from 'react';
import { Wallet, Calendar, Shield } from 'lucide-react';
import { ethers } from 'ethers';
import LoanManagerABI from '../ABI/lendLink.json';

const LoanManagerAddress = import.meta.env.VITE_LEND_LINK_CONTRACT_ADDRESS;

const BorrowPage = () => {
  const [formData, setFormData] = useState({
    amount: '',
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
