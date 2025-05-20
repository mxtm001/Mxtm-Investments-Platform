"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  LogOut,
  Wallet,
  HelpCircle,
  Info,
} from "lucide-react"
import { CurrencySelector, currencies } from "@/components/currency-selector"
import { CurrencyConverter } from "@/components/currency-converter"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Withdraw() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [walletAddress, setWalletAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      setUser(JSON.parse(storedUser))
    } catch (error) {
      localStorage.removeItem("user")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would make an API call to process the withdrawal
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setShowSuccess(true)

      // Reset form after a delay
      setTimeout(() => {
        setShowSuccess(false)
        setAmount("")
        setWalletAddress("")
        setPaymentMethod("")
      }, 5000)
    }, 1500)
  }

  // Get currency symbol for the input field
  const currencySymbol = currencies.find((c) => c.code === currency)?.symbol || "$"

  // Group currencies by region for display
  const groupedCurrencies = {
    northAmerica: currencies.filter((c) => c.region === "North America"),
    southAmerica: currencies.filter((c) => c.region === "South America"),
    europe: currencies.filter((c) => c.region === "Europe"),
    asia: currencies.filter((c) => c.region === "Asia"),
    oceania: currencies.filter((c) => c.region === "Oceania"),
    africa: currencies.filter((c) => c.region === "Africa"),
  }

  if (loading && !showSuccess) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050e24] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1735] text-white hidden md:block">
        <div className="p-4 border-b border-[#253256]">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-contain" />
            </div>
            <span className="ml-2 font-medium text-sm">MXTM INVESTMENT</span>
          </Link>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <BarChart2 className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/deposit"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <ArrowUpRight className="mr-2 h-5 w-5" />
                Deposit
              </Link>
            </li>
            <li>
              <Link href="/dashboard/withdraw" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
                <ArrowDownRight className="mr-2 h-5 w-5" />
                Withdraw
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/investments"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Investments
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/history"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <Clock className="mr-2 h-5 w-5" />
                History
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/support"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <HelpCircle className="mr-2 h-5 w-5" />
                Support
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white w-full text-left"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="bg-[#0a1735] p-4 flex justify-between items-center md:hidden">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-contain" />
            </div>
          </Link>
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Withdraw Funds</h1>
            <p className="text-gray-400">Withdraw your funds to your wallet</p>
          </div>

          {showSuccess ? (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#0a1735] border border-[#253256] rounded-lg p-8 max-w-md w-full mx-4 animate-fade-in">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-pulse">
                      <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Withdrawal Request Accepted!</h2>
                  <p className="text-gray-300 mb-6">
                    Your withdrawal request for {currencySymbol}
                    {amount} {currency} has been successfully submitted. We will process your request within 24 hours.
                  </p>
                  <Button className="bg-[#0066ff] hover:bg-[#0066ff]/90" onClick={() => setShowSuccess(false)}>
                    Return to Withdrawals
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Available Balance</CardTitle>
                <Wallet className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$0.00</div>
                <p className="text-sm text-gray-400 mt-1">Make a deposit to start investing</p>
              </CardContent>
            </Card>

            <Card className="bg-[#0a1735] border-[#253256] text-white md:row-span-2">
              <CardHeader>
                <CardTitle>Withdrawal Form</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <CurrencySelector value={currency} onChange={setCurrency} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-[#162040] border-[#253256] text-white pl-10"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        {currencySymbol}
                      </div>
                    </div>
                  </div>

                  {amount && currency !== "USD" && (
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        <span>Conversion to USD</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#0a1735] border-[#253256] text-white">
                              <p>All withdrawals are processed in USD</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <CurrencyConverter fromCurrency={currency} toCurrency="USD" amount={amount} />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="method">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="bg-[#162040] border-[#253256] text-white">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a1735] border-[#253256] text-white">
                        <SelectItem value="bitcoin">Bitcoin</SelectItem>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="usdt">USDT (TRC20)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wallet">Wallet Address</Label>
                    <Input
                      id="wallet"
                      type="text"
                      placeholder="Enter your wallet address"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="bg-[#162040] border-[#253256] text-white"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#0066ff] hover:bg-[#0066ff]/90"
                    disabled={!amount || !walletAddress || !paymentMethod || loading}
                  >
                    {loading ? "Processing..." : "Request Withdrawal"}
                  </Button>

                  <div className="text-xs text-gray-400 mt-4">
                    <p>Note: Withdrawals are processed within 24 hours.</p>
                    <p>Minimum withdrawal amount: $50</p>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader>
                <CardTitle>Withdrawal History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-400">No withdrawals found</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#0a1735] border-[#253256] text-white mt-8">
            <CardHeader>
              <CardTitle>Supported Withdrawal Currencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Popular Currencies</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[
                      { symbol: "$", code: "USD" },
                      { symbol: "€", code: "EUR" },
                      { symbol: "R$", code: "BRL" },
                      { symbol: "£", code: "GBP" },
                      { symbol: "¥", code: "JPY" },
                      { symbol: "C$", code: "CAD" },
                      { symbol: "A$", code: "AUD" },
                      { symbol: "₹", code: "INR" },
                      { symbol: "CHF", code: "CHF" },
                      { symbol: "¥", code: "CNY" },
                    ].map((curr, idx) => (
                      <div key={idx} className="p-3 bg-[#162040] rounded-md text-center">
                        <div className="text-lg font-bold">{curr.symbol}</div>
                        <div className="text-sm">{curr.code}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">North & South America</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[...groupedCurrencies.northAmerica, ...groupedCurrencies.southAmerica].map((curr, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-[#162040] rounded-md">
                          <span>{curr.code}</span>
                          <span className="text-gray-400">{curr.symbol}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Europe</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {groupedCurrencies.europe.map((curr, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-[#162040] rounded-md">
                          <span>{curr.code}</span>
                          <span className="text-gray-400">{curr.symbol}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Asia & Oceania</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[...groupedCurrencies.asia, ...groupedCurrencies.oceania].map((curr, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-[#162040] rounded-md">
                          <span>{curr.code}</span>
                          <span className="text-gray-400">{curr.symbol}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Africa</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {groupedCurrencies.africa.map((curr, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-[#162040] rounded-md">
                          <span>{curr.code}</span>
                          <span className="text-gray-400">{curr.symbol}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-400 mt-6">
                We support withdrawals in multiple currencies for your convenience. All withdrawals are processed in USD
                and then converted to your preferred currency. Exchange rates are updated in real-time.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
