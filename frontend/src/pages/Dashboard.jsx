import React from 'react';
import { TrendingUp, ShieldCheck, Target, ArrowUpRight, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Basic Card component
const Card = ({ children, className }) => (
  <div className={`rounded-xl ${className}`}>
    {children}
  </div>
);

const DashboardContent = () => {
  const marketStats = [
    { date: '01/10', totalValue: 25000, activeLoans: 12 },
    { date: '01/11', totalValue: 28000, activeLoans: 15 },
    { date: '01/12', totalValue: 27000, activeLoans: 14 },
    { date: '01/13', totalValue: 32000, activeLoans: 18 },
    { date: '01/14', totalValue: 30000, activeLoans: 16 }
  ];

  return (
    <div className="p-6 space-y-8 bg-black min-h-screen">
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-950 to-gray-900">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium">Active Loans</p>
                <p className="text-3xl font-bold text-gray-100 mt-2">28</p>
                <div className="flex items-center mt-2 text-emerald-400 text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>12% this week</span>
                  
                </div>
              </div>
              <div className="p-3 bg-blue-900/20 rounded-full">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-950 to-gray-900">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium">Avg. Interest Rate</p>
                <p className="text-3xl font-bold text-gray-100 mt-2">5.8%</p>
                <div className="flex items-center mt-2 text-emerald-400 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Market rate</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-900/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-950 to-gray-900">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium">Collateral Ratio</p>
                <p className="text-3xl font-bold text-gray-100 mt-2">150%</p>
                <div className="flex items-center mt-2 text-blue-400 text-sm">
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  <span>Platform minimum</span>
                </div>
              </div>
              <div className="p-3 bg-purple-900/20 rounded-full">
                <ShieldCheck className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Market Activity */}
      <Card className="bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-100">Market Activity</h3>
            <div className="flex items-center text-sm text-blue-400 cursor-pointer hover:text-blue-300">
              View details
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <LineChart data={marketStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#f3f4f6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="totalValue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Recent Activity & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-gray-950 to-gray-900">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Your Active Positions</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-900/50 rounded-xl hover:bg-gray-900/70 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-gray-100 font-medium">Active Loan #1234</span>
                    <p className="text-sm text-gray-400">Borrowed 1,000 LINK</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-900/20 text-emerald-400 text-xs rounded-full">Healthy</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-400">Collateral: 2 ETH</span>
                  <span className="text-gray-400">5.5% APR</span>
                </div>
              </div>

              <div className="p-4 bg-gray-900/50 rounded-xl hover:bg-gray-900/70 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-gray-100 font-medium">Funded Loan #458</span>
                    <p className="text-sm text-gray-400">Lent 2,500 LINK</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-900/20 text-blue-400 text-xs rounded-full">Earning</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-400">Duration: 30 days</span>
                  <span className="text-gray-400">6.2% APR</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-gray-950 to-gray-900">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Latest Opportunities</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-gray-900/50 rounded-xl hover:bg-gray-900/70 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-100 font-medium">5,000 LINK Requested</p>
                      <p className="text-sm text-gray-400">Collateral: 10 ETH</p>
                    </div>
                    <div className="flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">Duration: 60 days</span>
                    <span className="text-gray-400">Expected APR: 5.8%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;