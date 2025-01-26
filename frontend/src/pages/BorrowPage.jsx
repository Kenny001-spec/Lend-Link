import { useState } from 'react';
import { Wallet, Calendar, Shield, AlertTriangle, Info, DollarSign, Activity } from 'lucide-react';
import React, { useState, useEffect } from "react"
import { parseEther, formatEther } from "ethers"
import {useMarketStats} from "../hooks/useMarketStats"
import {useUserStats} from "../hooks/useUserStats"
import {useRepayLoan} from "../hooks/useRepayLoan"
import useCreateLoanRequest from "../hooks/useCreateLoanRequest"
import { useAppKitAccount } from "@reown/appkit/react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const BorrowPage = () => {
  const { address } = useAppKitAccount()
  const { repayLoan, loading: repayLoading } = useRepayLoan()
  const {
    totalLiquidity,
    avgInterestRate,
    activeLoans,
    availableToBorrow,
    loading: marketLoading,
    error: marketError,
  } = useMarketStats()
  const {
    activeLoans: userActiveLoans,
    totalBorrowed,
    totalCollateral,
    healthFactor,
    loading: userLoading,
  } = useUserStats()
  const createLoanRequest = useCreateLoanRequest()

  const [formData, setFormData] = useState({
    amount: "",
    duration: 30,
    maxInterestRate: 5.8,
    selectedCollateral: "LINK",
    selectedBorrowToken: "ETH",
    date: new Date().toISOString().split("T")[0], 
  })

  const [showActiveLoans, setShowActiveLoans] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [hasMetaMask, setHasMetaMask] = useState(false)

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetaMask(true)
    }
  }, [])

  useEffect(() => {
    if (marketError) {
      console.error("Market stats error:", marketError)
      toast.error(`Failed to fetch market statistics: ${marketError.message}`)
    }
  }, [marketError])

  const tokens = {
    ETH: {
      name: "Ethereum",
      symbol: "ETH",
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    },
    LINK: {
      name: "Chainlink",
      symbol: "LINK",
      logo: "https://cryptologos.cc/logos/chainlink-link-logo.png",
    },
  }

  const toggleActiveLoans = () => {
    setShowActiveLoans((prev) => !prev)
  }

  const collateralRequired = Number.parseFloat(formData.amount || 0) * 1.5
  const estimatedInterest =
    Number.parseFloat(formData.amount || 0) * (formData.maxInterestRate / 100) * (formData.duration / 365)
  const totalRepayment = Number.parseFloat(formData.amount || 0) + estimatedInterest

  const validateForm = () => {
    if (!address) {
      toast.error("Please connect your wallet first")
      return false
    }

    if (!formData.amount || formData.amount <= 0) {
      toast.error("Please enter a valid amount")
      return false
    }

    if (Number.parseFloat(formData.amount) > Number.parseFloat(availableToBorrow)) {
      toast.error("Can't borrow more than your available balance!")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    if (!hasMetaMask) {
      toast.error("MetaMask is not installed. Please install MetaMask to proceed.")
      return
    }

    try {
      setSubmitLoading(true)
      const amountInWei = parseEther(formData.amount.toString())
      const interestRateScaled = Math.floor(formData.maxInterestRate * 100)

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      // Create the loan request transaction
      const transaction = await createLoanRequest(amountInWei, interestRateScaled, formData.duration * 86400)

      // Send the transaction
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const tx = await signer.sendTransaction(transaction)

      // Wait for the transaction to be mined
      await tx.wait()

      setFormData({
        amount: "",
        duration: 30,
        maxInterestRate: 5.8,
        selectedCollateral: "LINK",
        selectedBorrowToken: "ETH",
        date: new Date().toISOString().split("T")[0],
      })

      toast.success("Loan request created successfully")
    } catch (error) {
      console.error("Error creating loan request:", error)
      toast.error(error.message || "Failed to create loan request")
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleRepayLoan = async (loanId) => {
    if (repayLoading) return

    try {
      await repayLoan(loanId)
      toast.success("Loan repaid successfully")
    } catch (error) {
      console.error("Error repaying loan:", error)
      toast.error(error.message || "Failed to repay loan")
    }
  }

  const renderStatCard = (label, value, icon, loading) => (
    <div className="bg-opacity-70 bg-gray-900 backdrop-blur-lg border border-opacity-10 border-blue-500 rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-opacity-30 hover:shadow-lg hover:shadow-blue-500/10">
      {loading ? (
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <div className="text-2xl">{icon}</div>
          <div className="flex-1">
            <div className="text-2xl font-semibold text-blue-500">{value}</div>
            <div className="text-sm text-gray-400">{label}</div>
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated stars background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,#4B82FF,rgba(0,0,0,0))] animate-stars"></div>
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_40px_70px,#4B82FF,rgba(0,0,0,0))] animate-stars-delayed"></div>
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_60px_100px,#4B82FF,rgba(0,0,0,0))] animate-stars-delayed-2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">Borrow</span>{" "}
          Assets
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {marketError ? (
            <div className="col-span-full bg-red-900 bg-opacity-20 border border-red-800 border-opacity-50 rounded-xl p-4 text-center">
              <p className="text-red-500">Failed to load market statistics. Please try again later.</p>
            </div>
          ) : (
            <>
              {renderStatCard("Total Liquidity", `${totalLiquidity} LINK`, "💧", marketLoading)}
              {renderStatCard("Interest Rate", `${avgInterestRate}%`, "📈", marketLoading)}
              {renderStatCard("Active Loans", activeLoans, "🔄", marketLoading)}
              {renderStatCard("Available", `${availableToBorrow} LINK`, "💰", marketLoading)}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Risk Warning */}
            <div className="bg-red-900 bg-opacity-20 border border-red-800 border-opacity-50 rounded-xl p-4 flex items-start gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <p className="text-sm text-white text-opacity-90">
                Borrowing assets involves risk of liquidation. Ensure you understand the collateralization process.
              </p>
            </div>

            {/* Borrow Amount */}
            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-lg border border-blue-500 border-opacity-10 rounded-xl p-6 transition-all duration-300 hover:border-opacity-30 hover:shadow-lg hover:shadow-blue-500/10">
              <h3 className="text-xl font-semibold text-blue-500 mb-4">Borrow Amount</h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={formData.selectedBorrowToken}
                    onChange={(e) => {
                      const newToken = e.target.value
                      setFormData((prev) => ({
                        ...prev,
                        selectedBorrowToken: newToken,
                        selectedCollateral: newToken, // Synchronize collateral
                      }))
                    }}
                    className="bg-gray-800 bg-opacity-80 border border-blue-500 border-opacity-20 rounded-lg px-4 py-2 text-white w-24 appearance-none bg-no-repeat bg-right"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                    }}
                  >
                    {Object.entries(tokens).map(([symbol, token]) => (
                      <option key={symbol} value={symbol}>
                        {symbol}
                      </option>
                    ))}
                  </select>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={formData.amount}
                      onChange={(e) => {
                        const value = e.target.value.replace(",", ".")
                        if (/^\d*\.?\d*$/.test(value) || value === "") {
                          setFormData((prev) => ({
                            ...prev,
                            amount: value,
                          }))
                        }
                      }}
                      className="flex-1 bg-gray-800 bg-opacity-80 border border-blue-500 border-opacity-20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                      placeholder="Enter amount"
                    />
                    <button
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: availableToBorrow,
                        }))
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                    >
                      MAX
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  Available: {availableToBorrow} {formData.selectedBorrowToken}
                </div>
              </div>
            </div>

            {/* Loan Terms */}
            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-lg border border-blue-500 border-opacity-10 rounded-xl p-6 transition-all duration-300 hover:border-opacity-30 hover:shadow-lg hover:shadow-blue-500/10">
              <h3 className="text-xl font-semibold text-blue-500 mb-4">Loan Terms</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Repayment Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-gray-800 bg-opacity-80 border border-blue-500 border-opacity-20 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Maximum Interest Rate: {formData.maxInterestRate}%</label>
                  <input
                    type="range"
                    min="1"
                    max="20"

                    step="0.1"
                    value={formData.maxInterestRate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        
                        maxInterestRate: Number.parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Collateral */}
            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-lg border border-blue-500 border-opacity-10 rounded-xl p-6 transition-all duration-300 hover:border-opacity-30 hover:shadow-lg hover:shadow-blue-500/10">
              <h3 className="text-xl font-semibold text-blue-500 mb-4">Collateral</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <select
                    value={formData.selectedCollateral}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        selectedCollateral: e.target.value,
                      }))
                    }
                    className="bg-gray-800 bg-opacity-80 border border-blue-500 border-opacity-20 rounded-lg px-4 py-2 text-white w-24 appearance-none bg-no-repeat bg-right"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                    }}
                  >
                    {Object.entries(tokens).map(([symbol, token]) => (
                      <option key={symbol} value={symbol}>
                        {symbol}
                      </option>
                    ))}
                  </select>
                  <div className="text-lg text-gray-300 flex-1">
                    Required: {collateralRequired.toFixed(2)} {formData.selectedCollateral}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                  <div>Collateral Ratio: 150%</div>
                  <div>Liquidation Threshold: 110%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Loan Summary */}
            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-lg border border-blue-500 border-opacity-10 rounded-xl p-6 transition-all duration-300 hover:border-opacity-30 hover:shadow-lg hover:shadow-blue-500/10">
              <h3 className="text-xl font-semibold text-blue-500 mb-4">Loan Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Borrow Amount</span>
                  <span>
                    {formData.amount || 0} {formData.selectedBorrowToken}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Duration</span>
                  <span>{formData.date}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Interest Rate</span>
                  <span>≤ {formData.maxInterestRate}%</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Estimated Interest</span>
                  <span>
                    {estimatedInterest.toFixed(2)} {formData.selectedBorrowToken}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Required Collateral</span>
                  <span>
                    {collateralRequired.toFixed(2)} {formData.selectedCollateral}
                  </span>
                </div>
                <div className="pt-3 mt-3 border-t border-blue-500 border-opacity-20 flex justify-between font-semibold text-lg">
                  <span>Total Repayment</span>
                  <span>
                    {totalRepayment.toFixed(2)} {formData.selectedBorrowToken}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Loans Toggle */}
            <button
              onClick={toggleActiveLoans}
              disabled={isLoading || userLoading}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 text-sm
                ${
                  isLoading || userLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-blue-500 bg-opacity-10 text-blue-500 border border-blue-500 border-opacity-20 hover:bg-opacity-20"
                }`}
            >
              {isLoading || userLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Loading...
                </span>
              ) : (
                `${showActiveLoans ? "Hide" : "Show"} Active Loans`
              )}
            </button>

            {/* Active Loans */}
            <div
              className={`transition-all duration-300 ease-out overflow-hidden ${
                showActiveLoans ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-gray-900 bg-opacity-70 backdrop-blur-lg border border-blue-500 border-opacity-10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-blue-500 mb-4">Active Loans</h3>
                {userActiveLoans && userActiveLoans.length > 0 ? (
                  <div className="space-y-4">
                    {userActiveLoans.map((loan) => (
                      <div
                        key={loan.id}
                        className="bg-gray-800 bg-opacity-80 border border-blue-500 border-opacity-20 rounded-xl p-4"
                      >
                        <div className="mb-3">
                          <div className="font-semibold mb-1">Loan #{loan.id}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>
                              {loan.amount} {formData.selectedBorrowToken}
                            </span>
                            <span className="text-blue-500">→</span>
                            <span>
                              {loan.repaymentAmount} {formData.selectedBorrowToken}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRepayLoan(loan.id)}
                          disabled={repayLoading}
                          className={`w-full py-2 px-4 rounded-lg transition-all duration-200 
                            ${
                              repayLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "bg-blue-500 bg-opacity-10 text-blue-500 hover:bg-opacity-20"
                            }`}
                        >
                          {repayLoading ? "Processing..." : "Repay"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">No active loans found.</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className={`w-full py-4 px-4 rounded-xl font-semibold transition-all duration-200 
                ${
                  submitLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white"
                }`}
            >
              {submitLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Create Loan Request"
              )}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  )
}

export default BorrowPage

