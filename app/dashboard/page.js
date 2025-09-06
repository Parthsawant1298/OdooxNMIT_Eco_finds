// app/dashboard/page.js
"use client"

import Header from "@/components/Header"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
    Activity,
    AlertTriangle,
    ArrowUp,
    BarChart2,
    Bell,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    DollarSign,
    Layers,
    Package,
    Percent,
    Plus,
    RefreshCw,
    Settings,
    ShoppingCart,
    Target,
    TrendingUp,
    User,
    Users,
    XCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalMaterials: 0,
            activeMaterials: 0,
            totalOrders: 0,
            pendingOrders: 0,
            totalRevenue: 0
        }
    })

    const fetchDashboardData = async () => {
        try {
            setIsRefreshing(true)
            const response = await fetch("/api/user/dashboard-stats")
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch dashboard data")
            }

            setDashboardData(prevData => ({
                ...prevData,
                ...data,
                stats: { ...prevData.stats, ...data.stats }
            }))
            setError("")
        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error)
            setError("Failed to load dashboard data")
        } finally {
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/user")
                const data = await response.json()

                if (!response.ok) {
                    throw new Error("Not authenticated")
                }

                setUser(data.user)
                await fetchDashboardData()
            } catch (error) {
                console.error("Authentication check failed:", error)
                router.push("/login?redirectTo=/dashboard&message=Please login to access your dashboard")
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [router])

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <div className="flex-grow flex items-center justify-center px-4">
                    <div className="flex flex-col items-center bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-sm w-full">
                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
                        <p className="text-green-700 font-medium text-sm sm:text-base">Loading dashboard...</p>
                        <p className="text-gray-500 text-xs sm:text-sm mt-2 text-center">Preparing your overview</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />

            <main className="flex-grow py-4 sm:py-6 lg:py-8">
                <div className="container mx-auto px-2 sm:px-4">
                    {/* Welcome banner */}
                    <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white opacity-5 rounded-full -mt-8 sm:-mt-16 -mr-8 sm:-mr-16"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-40 sm:h-40 bg-white opacity-5 rounded-full -mb-8 sm:-mb-16 -ml-8 sm:-ml-16"></div>

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between relative z-10 gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Welcome back, {user?.name?.split(" ")[0]}!</h1>
                                <p className="text-green-100 text-sm sm:text-base lg:text-lg">Here's what's happening with your business today.</p>
                                {error && (
                                    <div className="mt-2 sm:mt-3 bg-red-400 bg-opacity-20 px-3 sm:px-4 py-2 rounded-lg text-white flex items-center text-sm">
                                        <AlertTriangle size={14} className="mr-2 flex-shrink-0" />
                                        <span className="break-words">{error}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <Link
                                    href="/add-raw-material"
                                    className="bg-white text-green-700 hover:bg-green-50 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg shadow-md flex items-center justify-center font-medium transition-colors text-sm sm:text-base"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Add Material
                                </Link>
                                <button
                                    onClick={fetchDashboardData}
                                    disabled={isRefreshing}
                                    className="bg-green-500 hover:bg-green-400 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg shadow-md flex items-center justify-center font-medium transition-colors disabled:opacity-70 text-sm sm:text-base"
                                >
                                    <RefreshCw size={16} className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                                    {isRefreshing ? "Refreshing..." : "Refresh"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Stats cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                            <div className="flex justify-between items-start">
                                <div className="min-w-0 flex-1">
                                    <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">My Materials</p>
                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{dashboardData.stats?.totalMaterials || 0}</h3>
                                    <p className="text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs mt-2 sm:mt-3 inline-block">
                                        Active: {dashboardData.stats?.activeMaterials || 0}
                                    </p>
                                </div>
                                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                                    <Package size={20} className="sm:hidden" />
                                    <Package size={28} className="hidden sm:block" />
                                </div>
                            </div>
                            <Link
                                href="/my-materials"
                                className="mt-3 sm:mt-4 inline-flex items-center text-green-600 text-xs sm:text-sm font-medium hover:text-green-700 group"
                            >
                                View my materials
                                <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                            <div className="flex justify-between items-start">
                                <div className="min-w-0 flex-1">
                                    <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Total Orders</p>
                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{dashboardData.stats?.totalOrders || 0}</h3>
                                    <p className="text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs mt-2 sm:mt-3 inline-block">
                                        Pending: {dashboardData.stats?.pendingOrders || 0}
                                    </p>
                                </div>
                                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <ShoppingCart size={20} className="sm:hidden" />
                                    <ShoppingCart size={28} className="hidden sm:block" />
                                </div>
                            </div>
                            <Link
                                href="/order-history"
                                className="mt-3 sm:mt-4 inline-flex items-center text-green-600 text-xs sm:text-sm font-medium hover:text-green-700 group"
                            >
                                View orders
                                <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                            <div className="flex justify-between items-start">
                                <div className="min-w-0 flex-1">
                                    <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Total Revenue</p>
                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2 break-words">
                                        ₹{(dashboardData.stats?.totalRevenue || 0).toLocaleString()}
                                    </h3>
                                    <p className="text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs mt-2 sm:mt-3 inline-block">
                                        From completed orders
                                    </p>
                                </div>
                                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                                    <DollarSign size={20} className="sm:hidden" />
                                    <DollarSign size={28} className="hidden sm:block" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                            <div className="flex justify-between items-start">
                                <div className="min-w-0 flex-1">
                                    <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Quick Action</p>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-2">Get Started</h3>
                                    <p className="text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs mt-2 sm:mt-3 inline-block">
                                        Add your first material
                                    </p>
                                </div>
                                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                                    <Plus size={20} className="sm:hidden" />
                                    <Plus size={28} className="hidden sm:block" />
                                </div>
                            </div>
                            <Link
                                href="/add-raw-material"
                                className="mt-3 sm:mt-4 inline-flex items-center text-green-600 text-xs sm:text-sm font-medium hover:text-green-700 group"
                            >
                                Add material
                                <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                            <div className="p-2 bg-green-100 rounded-lg mr-3 text-green-600">
                                <Settings size={20} />
                            </div>
                            Quick Actions
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link
                                href="/add-raw-material"
                                className="w-full text-left px-4 py-3 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl transition-colors flex items-center group border border-green-100"
                            >
                                <div className="p-2 bg-white rounded-lg mr-3 text-green-600">
                                    <Plus size={18} />
                                </div>
                                <span className="font-medium">Add Material</span>
                                <ChevronRight size={14} className="ml-auto transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/my-materials"
                                className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition-colors flex items-center group border border-blue-100"
                            >
                                <div className="p-2 bg-white rounded-lg mr-3 text-blue-600">
                                    <Package size={18} />
                                </div>
                                <span className="font-medium">My Materials</span>
                                <ChevronRight size={14} className="ml-auto transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/surplus"
                                className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl transition-colors flex items-center group border border-purple-100"
                            >
                                <div className="p-2 bg-white rounded-lg mr-3 text-purple-600">
                                    <Package size={18} />
                                </div>
                                <span className="font-medium">Surplus</span>
                                <ChevronRight size={14} className="ml-auto transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/profile"
                                className="w-full text-left px-4 py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl transition-colors flex items-center group border border-indigo-100"
                            >
                                <div className="p-2 bg-white rounded-lg mr-3 text-indigo-600">
                                    <User size={18} />
                                </div>
                                <span className="font-medium">Profile</span>
                                <ChevronRight size={14} className="ml-auto transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
