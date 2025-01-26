import { useState } from 'react';
import useContractInstance from './useContractInstance';
import { useAppKitAccount } from '@reown/appkit/react';
import { toast } from 'react-toastify';

// Hook to handle loan repayments
export const useRepayLoan = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const [loading, setLoading] = useState(false);

  const repayLoan = async (loanId) => {
    if (!contract || !address) {
      toast.error('Please connect your wallet');
      return false;
    }

    try {
      setLoading(true);
      const tx = await contract.repayLoanWithReward(loanId);
      await tx.wait();
      toast.success('Loan repaid successfully');
      return true;
    } catch (error) {
      console.error('Error repaying loan:', error);
      toast.error('Failed to repay loan');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { repayLoan, loading };
};