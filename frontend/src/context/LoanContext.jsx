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
                return "Created";

            default:
                return "Not active";
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
                const matchedStatus = loan.matched ? "Matched" : "Not Matched";




                return {

                    loanId: loanId,
                    borrower: loan.borrower,
                    amount: formatUnits(loan.amount, 18, 3),
                    maxInterestRate: (Number(loan.maxInterestRate) / 100).toFixed(1),
                    dueDate: dueDate,
                    duration: durationInDays,
                    matched: matchedStatus,
                    collateralAmount: formatEther(loan.collateralAmount, 18, 3).toLocaleString(),
                    isActive: formatEnum(loan.active),
                    collateralRatio: "120"
                }
            });

            setLoanRequests(formattedLoanRequests)
            console.log({ formattedLoanRequests });
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