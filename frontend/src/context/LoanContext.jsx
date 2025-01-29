import { createContext, useCallback, useContext, useEffect, useState } from "react";
import useContractInstance from "../hooks/useContractInstance";
import { formatUnits } from "ethers";
import { formatEther } from "ethers";



const loanContext = createContext({
    loanRequests: []
});

export const LoanContextProvider = ({ children }) => {

    const [loanRequests, setLoanRequests] = useState([]);

    const readOnlyTodoContract = useContractInstance();

    const formatEnum = (value) => {

        const status = Number(value);

        switch (status) {
            case 1:
                return true;

            default:
                return false;
        }
    };



    const getLoanRequests = useCallback(async () => {

        if (!readOnlyTodoContract) return;


        try {
            const data = await readOnlyTodoContract.getAllLoanRequests();


            const formattedLoanRequests = data.map((loan) => {




                const dueDate = new Date(Number(loan.dueDate) * 1000).toLocaleString(); // Convert Unix timestamp to human-readable date

                const durationInDays = Math.floor(Number(loan.duration) / (60 * 60 * 24)); // Convert seconds to days

                const loanId = Number(loan.loanId); // Convert loanId BigInt to number




                return {

                    loanId: loanId,
                    borrower: String(loan.borrower),
                    amount: formatUnits(loan.amount, 18, 3),
                    maxInterestRate: (Number(loan.maxInterestRate) / 100).toFixed(1),
                    dueDate: dueDate,
                    duration: durationInDays > 0 ? durationInDays : Math.floor(Number(loan.duration) / (60 * 60)),
                    matched: loan.matched,
                    collateralAmount: formatEther(loan.collateralAmount, 18, 3).toLocaleString(),
                    isActive: Boolean(loan.isActive),
                    collateralRatio: "120",
                    isDays: durationInDays > 0 ? true : false
                }
            });

            setLoanRequests(formattedLoanRequests)
        } catch (error) {

            console.log("Error fetching Loans", error);

        }
    }, [readOnlyTodoContract, formatEnum]);

    useEffect(() => {

        getLoanRequests();
    }, []);


    return (
        <loanContext.Provider value={{ loanRequests }}>
            {children}
        </loanContext.Provider>
    )

}


export const useLoanRequests = () => {
    const context = useContext(loanContext);

    return context

}