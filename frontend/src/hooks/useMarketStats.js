import { useState, useEffect } from 'react';
import {  formatUnits } from 'ethers';
import useContractInstance from './useContractInstance';
import { toast } from 'react-toastify';

// Hook to fetch market statistics
export const useMarketStats = () => {
  const contract = useContractInstance(false);
  const [stats, setStats] = useState({
    totalLiquidity: '0',
    avgInterestRate: '0',
    activeLoans: '0',
    availableToBorrow: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!contract) return;
      try {
        setLoading(true);
        const allLoans = await contract.getAllLoanRequests();
        
        const totalLiquidity = 0n;
        const activeLoansCount = 0;
        const totalInterestRate = 0;

        allLoans.forEach(loan => {
          if (loan.isActive) {
            totalLiquidity += loan.amount;
            activeLoansCount++;
            totalInterestRate += Number(loan.maxInterestRate);
          }
        });

        const avgInterestRate = activeLoansCount > 0 ? 
          (totalInterestRate / activeLoansCount).toFixed(2) : '0';

        setStats({
          totalLiquidity: (totalLiquidity),
          avgInterestRate,
          activeLoans: activeLoansCount.toString(),
          availableToBorrow: formatUnits(totalLiquidity, 18)
        });
      } catch (error) {
        console.error('Error fetching market stats:', error);
        toast.error('Failed to fetch market statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [contract]);

  return { ...stats, loading };
};



