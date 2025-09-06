"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart2, PieChart, Calendar, DollarSign, Package, ShoppingCart } from 'lucide-react';

export default function DashboardAnalytics({ stats }) {
  const [analyticsData, setAnalyticsData] = useState({
    monthlyRevenue: [],
    ordersByStatus: [],
    topMaterials: [],
    recentActivity: []
  });

  // Mock data for demonstration - replace with real API calls
  useEffect(() => {
    // Simulate monthly revenue data
    const monthlyRevenue = [
      { month: 'Jan', revenue: Math.floor(Math.random() * 50000) },
      { month: 'Feb', revenue: Math.floor(Math.random() * 50000) },
      { month: 'Mar', revenue: Math.floor(Math.random() * 50000) },
      { month: 'Apr', revenue: Math.floor(Math.random() * 50000) },
      { month: 'May', revenue: Math.floor(Math.random() * 50000) },
      { month: 'Jun', revenue: Math.floor(Math.random() * 50000) }
    ];

    const ordersByStatus = [
      { status: 'Delivered', count: stats?.deliveredOrders || 0, color: 'bg-green-500' },
      { status: 'Processing', count: stats?.pendingOrders || 0, color: 'bg-yellow-500' },
      { status: 'Failed', count: Math.max(0, (stats?.totalOrders || 0) - (stats?.deliveredOrders || 0) - (stats?.pendingOrders || 0)), color: 'bg-red-500' }
    ];

    setAnalyticsData({
      monthlyRevenue,
      ordersByStatus,
      topMaterials: [],
      recentActivity: []
    });
  }, [stats]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Simple bar chart component
  const SimpleBarChart = ({ data, height = 200 }) => {
    if (!data || data.length === 0) return <div className="text-gray-500">No data available</div>;
    
    const maxValue = Math.max(...data.map(item => item.revenue));
    
    return (
      <div className="flex items-end justify-between space-x-2" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: height - 40 }}>
              <div 
                className="bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg transition-all duration-1000 ease-out flex items-end justify-center"
                style={{ 
                  height: `${(item.revenue / maxValue) * 100}%`,
                  minHeight: '4px'
                }}
              >
                <span className="text-white text-xs font-semibold mb-1 px-1">
                  ₹{(item.revenue / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-600 mt-1 font-medium">{item.month}</span>
          </div>
        ))}
      </div>
    );
  };

  // Simple donut chart component
  const SimpleDonutChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="text-gray-500">No data available</div>;
    
    const total = data.reduce((sum, item) => sum + item.count, 0);
    if (total === 0) return <div className="text-gray-500">No orders yet</div>;
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = ((item.count / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm font-medium text-gray-700">{item.status}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-900">{item.count}</span>
                <span className="text-xs text-gray-500">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Key metrics cards
  const MetricsCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
              {trend === 'up' ? <TrendingUp size={16} /> : trend === 'down' ? <TrendingDown size={16} /> : null}
              <span className="text-sm ml-1">{change}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-teal-50 rounded-full">
          <Icon size={24} className="text-teal-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Revenue This Month"
          value={formatCurrency(stats?.totalRevenue || 0)}
          change="+12.5%"
          icon={DollarSign}
          trend="up"
        />
        <MetricsCard
          title="Active Materials"
          value={stats?.activeMaterials || 0}
          change={`${stats?.totalMaterials || 0} total`}
          icon={Package}
        />
        <MetricsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          change={`${stats?.pendingOrders || 0} pending`}
          icon={ShoppingCart}
        />
        <MetricsCard
          title="Delivered Orders"
          value={stats?.deliveredOrders || 0}
          change="Success rate: 95%"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart2 size={20} className="mr-2 text-teal-600" />
              Monthly Revenue Trend
            </h3>
            <span className="text-sm text-gray-500">Last 6 months</span>
          </div>
          <SimpleBarChart data={analyticsData.monthlyRevenue} />
        </div>

        {/* Orders Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart size={20} className="mr-2 text-teal-600" />
              Orders by Status
            </h3>
            <span className="text-sm text-gray-500">Current period</span>
          </div>
          <SimpleDonutChart data={analyticsData.ordersByStatus} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
          <Calendar size={20} className="mr-2 text-teal-600" />
          Quick Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900">Average Order Value</h4>
            <p className="text-2xl font-bold text-blue-600">
              {stats?.totalOrders > 0 ? formatCurrency((stats?.totalRevenue || 0) / stats.totalOrders) : '₹0'}
            </p>
            <p className="text-sm text-blue-600">Per order</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900">Completion Rate</h4>
            <p className="text-2xl font-bold text-green-600">
              {stats?.totalOrders > 0 ? Math.round(((stats?.deliveredOrders || 0) / stats.totalOrders) * 100) : 0}%
            </p>
            <p className="text-sm text-green-600">Orders delivered</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-900">Material Utilization</h4>
            <p className="text-2xl font-bold text-purple-600">
              {stats?.totalMaterials > 0 ? Math.round(((stats?.activeMaterials || 0) / stats.totalMaterials) * 100) : 0}%
            </p>
            <p className="text-sm text-purple-600">Materials active</p>
          </div>
        </div>
      </div>
    </div>
  );
}