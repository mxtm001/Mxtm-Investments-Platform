"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  LogOut,
  Copy,
  Bitcoin,
  HelpCircle,
  Info,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurrencySelector, currencies } from "@/components/currency-selector"
import { CurrencyConverter } from "@/components/currency-converter"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PaymentProofUpload } from "@/components/payment-proof-upload"

export default function Deposit() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [copied, setCopied] = useState(false)
  const [showProofUpload, setShowProofUpload] = useState(false)
  const [activePaymentMethod, setActivePaymentMethod] = useState("bitcoin")
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

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePaymentMade = (paymentMethod: string) => {
    setActivePaymentMethod(paymentMethod)
    setShowProofUpload(true)
  }

  const handleProofSuccess = () => {
    setShowProofUpload(false)
    // In a real app, you might want to refresh the user's balance or show a notification
  }

  // Group currencies by region for display
  const groupedCurrencies = {
    northAmerica: currencies.filter((c) => c.region === "North America"),
    southAmerica: currencies.filter((c) => c.region === "South America"),
    europe: currencies.filter((c) => c.region === "Europe"),
    asia: currencies.filter((c) => c.region === "Asia"),
    oceania: currencies.filter((c) => c.region === "Oceania"),
    africa: currencies.filter((c) => c.region === "Africa"),
  }

  // Get currency symbol for the input field
  const currencySymbol = currencies.find((c) => c.code === currency)?.symbol || "$"

  if (loading) {
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
              <Link href="/dashboard/deposit" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
                <ArrowUpRight className="mr-2 h-5 w-5" />
                Deposit
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/withdraw"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
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
            <h1 className="text-2xl font-bold text-white">Deposit Funds</h1>
            <p className="text-gray-400">Add funds to your account to start investing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader>
                <CardTitle>Deposit Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                              <p>All investments are processed in USD</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <CurrencyConverter fromCurrency={currency} toCurrency="USD" amount={amount} />
                    </div>
                  )}

                  <Button className="w-full bg-[#0066ff] hover:bg-[#0066ff]/90">Continue</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="bitcoin" onValueChange={setActivePaymentMethod}>
                  <TabsList className="bg-[#162040] border-[#253256]">
                    <TabsTrigger value="bitcoin" className="data-[state=active]:bg-[#0a1735]">
                      Bitcoin
                    </TabsTrigger>
                    <TabsTrigger value="ethereum" className="data-[state=active]:bg-[#0a1735]">
                      Ethereum
                    </TabsTrigger>
                    <TabsTrigger value="usdt" className="data-[state=active]:bg-[#0a1735]">
                      USDT
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="bitcoin" className="mt-4 space-y-4">
                    <div className="flex justify-center">
                      <Bitcoin className="h-16 w-16 text-[#f7931a]" />
                    </div>
                    <div className="p-4 bg-[#162040] rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Bitcoin Address</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleCopyAddress("1EwSeZbK8RW5EgRc96RnhjcLmGQA6zZ2RV")}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <p className="text-sm break-all">1EwSeZbK8RW5EgRc96RnhjcLmGQA6zZ2RV</p>
                    </div>

                    {amount && (
                      <div className="p-4 bg-[#162040] rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Amount to send (approx.)</span>
                          <span className="text-sm font-medium">≈ 0.00{amount} BTC</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          The exact BTC amount will be calculated at the time of payment based on current exchange
                          rates.
                        </p>
                      </div>
                    )}

                    <div className="text-sm text-gray-400">
                      <p>1. Send the exact amount of BTC to the address above.</p>
                      <p>2. After sending, click on "I've made payment" button.</p>
                      <p>3. Upload a screenshot of your transaction as proof.</p>
                      <p>4. Your deposit will be credited once confirmed on the blockchain.</p>
                    </div>
                    <Button
                      className="w-full bg-[#0066ff] hover:bg-[#0066ff]/90"
                      onClick={() => handlePaymentMade("Bitcoin")}
                    >
                      I've made payment
                    </Button>
                  </TabsContent>

                  <TabsContent value="ethereum" className="mt-4 space-y-4">
                    <div className="flex justify-center">
                      <svg className="h-16 w-16" viewBox="0 0 784.37 1277.39" xmlns="http://www.w3.org/2000/svg">
                        <g>
                          <polygon
                            fill="#343434"
                            points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"
                          />
                          <polygon fill="#8C8C8C" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33" />
                          <polygon
                            fill="#3C3C3B"
                            points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"
                          />
                          <polygon fill="#8C8C8C" points="392.07,1277.38 392.07,956.52 -0,724.89" />
                          <polygon fill="#141414" points="392.07,882.29 784.13,650.54 392.07,472.33" />
                          <polygon fill="#393939" points="0,650.54 392.07,882.29 392.07,472.33" />
                        </g>
                      </svg>
                    </div>
                    <div className="p-4 bg-[#162040] rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Ethereum Address</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleCopyAddress("0x4c2bba6f32aa4b804c43dd25c4c3c311dd8016cf")}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <p className="text-sm break-all">0x4c2bba6f32aa4b804c43dd25c4c3c311dd8016cf</p>
                    </div>

                    {amount && (
                      <div className="p-4 bg-[#162040] rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Amount to send (approx.)</span>
                          <span className="text-sm font-medium">≈ 0.00{amount} ETH</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          The exact ETH amount will be calculated at the time of payment based on current exchange
                          rates.
                        </p>
                      </div>
                    )}

                    <div className="text-sm text-gray-400">
                      <p>1. Send the exact amount of ETH to the address above.</p>
                      <p>2. After sending, click on "I've made payment" button.</p>
                      <p>3. Upload a screenshot of your transaction as proof.</p>
                      <p>4. Your deposit will be credited once confirmed on the blockchain.</p>
                    </div>
                    <Button
                      className="w-full bg-[#0066ff] hover:bg-[#0066ff]/90"
                      onClick={() => handlePaymentMade("Ethereum")}
                    >
                      I've made payment
                    </Button>
                  </TabsContent>

                  <TabsContent value="usdt" className="mt-4 space-y-4">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 rounded-full bg-[#26A17B] flex items-center justify-center text-white font-bold text-2xl">
                        ₮
                      </div>
                    </div>
                    <div className="p-4 bg-[#162040] rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">USDT Address (TRC20)</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleCopyAddress("TFBXLYCcuDLJqkN7ggxzfKMHmW64L7u9AA")}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <p className="text-sm break-all">TFBXLYCcuDLJqkN7ggxzfKMHmW64L7u9AA</p>
                    </div>

                    {amount && currency !== "USD" && (
                      <div className="p-4 bg-[#162040] rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Amount to send (USDT)</span>
                          <span className="text-sm font-medium">
                            {currency === "USD" ? amount : "≈ calculating..."} USDT
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Send the exact USDT amount as calculated at the time of payment.
                        </p>
                      </div>
                    )}

                    <div className="text-sm text-gray-400">
                      <p>1. Send the exact amount of USDT to the address above.</p>
                      <p>2. After sending, click on "I've made payment" button.</p>
                      <p>3. Upload a screenshot of your transaction as proof.</p>
                      <p>4. Your deposit will be credited once confirmed on the blockchain.</p>
                    </div>
                    <Button
                      className="w-full bg-[#0066ff] hover:bg-[#0066ff]/90"
                      onClick={() => handlePaymentMade("USDT")}
                    >
                      I've made payment
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#0a1735] border-[#253256] text-white mt-8">
            <CardHeader>
              <CardTitle>Supported Currencies</CardTitle>
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
                We support multiple currencies for your convenience. All investments are processed in USD, but you can
                deposit in your preferred currency. Exchange rates are updated in real-time.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Payment Proof Upload Dialog */}
      <Dialog open={showProofUpload} onOpenChange={setShowProofUpload}>
        <DialogContent className="bg-transparent border-0 p-0 max-w-md">
          <PaymentProofUpload
            paymentMethod={activePaymentMethod}
            amount={amount}
            currency={currency}
            onClose={() => setShowProofUpload(false)}
            onSuccess={handleProofSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
