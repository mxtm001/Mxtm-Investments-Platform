"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Check, FileImage, Upload, X } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PaymentProofUploadProps {
  paymentMethod: string
  amount: string
  currency: string
  onClose: () => void
  onSuccess: () => void
}

export function PaymentProofUpload({ paymentMethod, amount, currency, onClose, onSuccess }: PaymentProofUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check file type
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, etc.)")
      return
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setError(null)
    setFile(selectedFile)

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files?.[0]
    if (!droppedFile) return

    // Check file type
    if (!droppedFile.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, etc.)")
      return
    }

    // Check file size (max 5MB)
    if (droppedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setError(null)
    setFile(droppedFile)

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(droppedFile)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please upload a proof of payment")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // In a real app, you would upload the file to your server
      // For example using FormData:
      // const formData = new FormData()
      // formData.append('file', file)
      // formData.append('transactionId', transactionId)
      // formData.append('notes', notes)
      // formData.append('paymentMethod', paymentMethod)
      // formData.append('amount', amount)
      // formData.append('currency', currency)
      // await fetch('/api/payment-proof', { method: 'POST', body: formData })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message
      setSuccess(true)

      // Call the success callback after a delay
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err) {
      setError("Failed to upload proof of payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="bg-[#0a1735] border-[#253256] text-white w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Payment Proof Submitted</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <p className="mb-4">
            Thank you! Your payment proof has been submitted successfully. We will verify your payment and update your
            account balance shortly.
          </p>
          <p className="text-sm text-gray-400">You will receive a notification once your payment is confirmed.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose} className="w-full bg-[#0066ff] hover:bg-[#0066ff]/90">
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="bg-[#0a1735] border-[#253256] text-white w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Payment Proof</CardTitle>
        <CardDescription className="text-gray-400">
          Please upload a screenshot or receipt of your {paymentMethod} transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Transaction Details</Label>
            <div className="p-3 bg-[#162040] rounded-md">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Payment Method:</span>
                <span>{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Amount:</span>
                <span>
                  {amount} {currency}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID / Hash</Label>
            <Input
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID or hash"
              className="bg-[#162040] border-[#253256] text-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Proof</Label>
            <div
              className={`border-2 border-dashed rounded-md p-4 text-center ${
                previewUrl ? "border-[#253256]" : "border-[#253256] hover:border-[#0066ff]"
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative">
                  <div className="relative h-48 w-full">
                    <Image
                      src={previewUrl || "/placeholder.svg"}
                      alt="Payment proof preview"
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="text-sm text-gray-400 mt-2">{file?.name}</p>
                </div>
              ) : (
                <div className="py-4">
                  <FileImage className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400 mb-2">Drag and drop your file here or click to browse</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#162040]"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, GIF (Max size: 5MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about your payment"
              className="bg-[#162040] border-[#253256] text-white min-h-[80px]"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose} className="bg-transparent">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-[#0066ff] hover:bg-[#0066ff]/90" disabled={loading}>
          {loading ? "Uploading..." : "Submit Proof"}
        </Button>
      </CardFooter>
    </Card>
  )
}
