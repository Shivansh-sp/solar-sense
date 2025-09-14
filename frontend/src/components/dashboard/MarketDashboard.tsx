'use client'

import { motion } from 'framer-motion'
import { 
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface MarketDashboardProps {
  data?: {
    currentPrice?: number;
    volume?: number;
    trades?: number;
  }
}

export default function MarketDashboard({ data }: MarketDashboardProps) {
  // Removed unused state variables

  const marketStats = [
    {
      title: 'Current Price',
      value: '$0.15/kWh',
      change: '+5.2%',
      changeType: 'positive',
      icon: CurrencyDollarIcon
    },
    {
      title: 'Active Trades',
      value: '5',
      change: '+2',
      changeType: 'positive',
      icon: ChartBarIcon
    },
    {
      title: 'Volume Today',
      value: '24.3 kWh',
      change: '+12.5%',
      changeType: 'positive',
      icon: ArrowUpIcon
    },
    {
      title: 'Avg. Trade Size',
      value: '4.9 kWh',
      change: '-3.1%',
      changeType: 'negative',
      icon: ArrowDownIcon
    }
  ]

  const activeTrades = [
    {
      id: 'trade-1',
      seller: 'Green Valley Home',
      buyer: 'Sunshine Residence',
      amount: '5.2 kWh',
      price: '$0.15/kWh',
      total: '$0.78',
      status: 'pending',
      timeLeft: '4:32'
    },
    {
      id: 'trade-2',
      seller: 'Eco District',
      buyer: 'Smart Home Alpha',
      amount: '3.1 kWh',
      price: '$0.14/kWh',
      total: '$0.43',
      status: 'completed',
      timeLeft: '0:00'
    },
    {
      id: 'trade-3',
      seller: 'Community Center',
      buyer: 'Medical Facility',
      amount: '8.5 kWh',
      price: '$0.16/kWh',
      total: '$1.36',
      status: 'pending',
      timeLeft: '2:15'
    }
  ]

  const priceHistory = [
    { time: '00:00', price: 0.12 },
    { time: '04:00', price: 0.10 },
    { time: '08:00', price: 0.15 },
    { time: '12:00', price: 0.18 },
    { time: '16:00', price: 0.16 },
    { time: '20:00', price: 0.14 },
    { time: '24:00', price: 0.13 }
  ]

  return (
    <div className="space-y-8">
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center space-x-1">
                {stat.changeType === 'positive' ? (
                  <ArrowUpIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.title}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Price Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Price History (24h)
          </h3>
          
          <div className="h-64 flex items-end space-x-2">
            {priceHistory.map((point, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                  style={{ height: `${(point.price / 0.18) * 200}px` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">{point.time}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>Low: $0.10/kWh</span>
            <span>High: $0.18/kWh</span>
          </div>
        </motion.div>

        {/* Active Trades */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Active Trades
          </h3>
          
          <div className="space-y-4">
            {activeTrades.map((trade, index) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      trade.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">
                      {trade.seller} → {trade.buyer}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{trade.timeLeft}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Amount</div>
                    <div className="font-medium">{trade.amount}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Price</div>
                    <div className="font-medium">{trade.price}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Total</div>
                    <div className="font-medium text-green-600">{trade.total}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trading Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Quick Trading Actions
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sell Energy */}
          <div className="p-6 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-4">Sell Energy</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Energy
                </label>
                <div className="text-2xl font-bold text-green-600">7.6 kWh</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per kWh
                </label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue="0.15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                List for Sale
              </motion.button>
            </div>
          </div>

          {/* Buy Energy */}
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-4">Buy Energy</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Needed
                </label>
                <div className="text-2xl font-bold text-blue-600">3.2 kWh</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price per kWh
                </label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue="0.18"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Find Sellers
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
