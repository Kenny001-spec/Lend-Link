import { useState, useEffect } from 'react';
import { formatEther } from 'ethers';
import useContractInstance from './useContractInstance';
import { useAppKitAccount } from '@reown/appkit/react';
import { toast } from 'react-toastify';

// Hook to fetch user loan statistics
export const useUserStats = () => {
  const contract = useContractInstance(false);
  const { address } = useAppKitAccount();
  const [stats, setStats] = useState({
    activeLoans: [],
    totalBorrowed: '0',
    totalCollateral: '0',
    healthFactor: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!contract || !address) return;
      try {
        setLoading(true);
        const userLoans = await contract.getUserLoanRequests(address);
        
        const totalBorrowed = 0n;
        const totalCollateral = 0n;
        const activeLoans = [];

        userLoans.forEach(loan => {
          if (loan.isActive) {
            totalBorrowed += loan.amount;
            totalCollateral += loan.collateralAmount;
            activeLoans.push({
              id: Number(loan.loanId),
              amount: formatEther(loan.amount),
              collateral: 'ETH',
              duration: Number(loan.duration) / 86400,
              interestRate: Number(loan.maxInterestRate) / 100,
              repaymentAmount: formatEther(loan.amount * (100n + BigInt(loan.maxInterestRate)) / 100n)
            });
          }
        });

        const healthFactor = totalBorrowed > 0n ? 
          Number(totalCollateral) / Number(totalBorrowed) : 0;

        setStats({
          activeLoans,
          totalBorrowed: formatEther(totalBorrowed),
          totalCollateral: formatEther(totalCollateral),
          healthFactor: healthFactor.toFixed(2)
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
        toast.error('Failed to fetch user statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
    const interval = setInterval(fetchUserStats, 15000);
    return () => clearInterval(interval);
  }, [contract, address]);

  return { ...stats, loading };
};