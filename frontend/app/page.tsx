'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { useState } from 'react'
import { TOKEN_ADDRESS, TOKEN_ABI } from '@/lib/contracts'
import { Coins, Send, Flame, Users } from 'lucide-react'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [transferTo, setTransferTo] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [burnAmount, setBurnAmount] = useState('')

  // Read token data
  const { data: tokenName } = useReadContract({
    address: TOKEN_ADDRESS as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: 'name',
  })

  const { data: tokenSymbol } = useReadContract({
    address: TOKEN_ADDRESS as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: 'symbol',
  })

  const { data: decimals } = useReadContract({
    address: TOKEN_ADDRESS as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: 'decimals',
  })

  const { data: totalSupply } = useReadContract({
    address: TOKEN_ADDRESS as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: 'totalSupply',
  })

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: TOKEN_ADDRESS as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // Write functions
  const { writeContract: transfer, data: transferHash } = useWriteContract()
  const { writeContract: burn, data: burnHash } = useWriteContract()

  const { isLoading: isTransferring } = useWaitForTransactionReceipt({
    hash: transferHash,
  })

  const { isLoading: isBurning } = useWaitForTransactionReceipt({
    hash: burnHash,
  })

  const handleTransfer = async () => {
    if (!transferTo || !transferAmount || !decimals) return
    try {
      transfer({
        address: TOKEN_ADDRESS as `0x${string}`,
        abi: TOKEN_ABI,
        functionName: 'transfer',
        args: [transferTo as `0x${string}`, parseUnits(transferAmount, decimals)],
      })
      setTransferTo('')
      setTransferAmount('')
      setTimeout(() => refetchBalance(), 2000)
    } catch (error) {
      console.error('Transfer error:', error)
    }
  }

  const handleBurn = async () => {
    if (!burnAmount || !decimals) return
    try {
      burn({
        address: TOKEN_ADDRESS as `0x${string}`,
        abi: TOKEN_ABI,
        functionName: 'burn',
        args: [parseUnits(burnAmount, decimals)],
      })
      setBurnAmount('')
      setTimeout(() => refetchBalance(), 2000)
    } catch (error) {
      console.error('Burn error:', error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-base-900 via-base-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <Coins className="w-10 h-10 text-base-400" />
            <h1 className="text-4xl font-bold text-white">
              {tokenName || 'Base Chain Token'}
            </h1>
          </div>
          <ConnectButton />
        </div>

        {!isConnected ? (
          <div className="text-center py-20">
            <Coins className="w-24 h-24 text-base-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to LITTLE EINSTEIN 🧠
            </h2>
            <p className="text-gray-400 mb-8">
              Connect your wallet to interact with LEINSTEIN token - 250 Billion Supply on Base L2
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Token Info Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Coins className="w-6 h-6" />
                Token Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">Name</span>
                  <span className="text-white font-semibold">{tokenName || '-'}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">Symbol</span>
                  <span className="text-white font-semibold">{tokenSymbol || '-'}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">Total Supply</span>
                  <span className="text-white font-semibold">
                    {totalSupply && decimals
                      ? Number(formatUnits(totalSupply, decimals)).toLocaleString()
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-base-900/50 rounded-lg border border-base-700">
                  <span className="text-gray-400">Your Balance</span>
                  <span className="text-base-400 font-bold text-xl">
                    {balance && decimals
                      ? Number(formatUnits(balance, decimals)).toLocaleString()
                      : '0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Transfer Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Send className="w-6 h-6" />
                Transfer Tokens
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Recipient Address</label>
                  <input
                    type="text"
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-base-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Amount</label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-base-500"
                  />
                </div>
                <button
                  onClick={handleTransfer}
                  disabled={isTransferring || !transferTo || !transferAmount}
                  className="w-full py-3 bg-base-600 hover:bg-base-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {isTransferring ? 'Transferring...' : 'Transfer'}
                </button>
              </div>
            </div>

            {/* Burn Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                Burn Tokens
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Amount to Burn</label>
                  <input
                    type="number"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  onClick={handleBurn}
                  disabled={isBurning || !burnAmount}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {isBurning ? 'Burning...' : 'Burn Tokens'}
                </button>
                <p className="text-sm text-gray-400">
                  Burning tokens permanently removes them from circulation
                </p>
              </div>
            </div>

            {/* Contract Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Contract Info
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Token Contract</label>
                  <div className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg">
                    <code className="text-base-400 text-sm break-all">
                      {TOKEN_ADDRESS}
                    </code>
                  </div>
                </div>
                <a
                  href={`https://basescan.org/address/${TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-gray-700 hover:bg-gray-600 text-white text-center font-semibold rounded-lg transition-colors"
                >
                  View on BaseScan
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p>Built on Base Chain L2 • Powered by Ethereum</p>
        </div>
      </div>
    </main>
  )
}
