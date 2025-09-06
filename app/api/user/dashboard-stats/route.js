// app/api/user/dashboard-stats/route.js
import connectDB from '@/lib/mongodb';
import RawMaterial from '@/models/rawMaterial';
import Order from '@/models/order';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
    try {
        console.log('📊 Dashboard stats API called');
        
        // Get user session from cookie
        let userId;
        try {
            const cookieStore = await cookies();
            userId = cookieStore.get('userId')?.value;
            console.log('👤 User ID from cookie:', userId);
        } catch (cookieError) {
            console.error('❌ Cookie error:', cookieError);
            return NextResponse.json(
                { success: false, error: 'Failed to read authentication cookies' },
                { status: 500 }
            );
        }

        if (!userId) {
            console.log('❌ No user ID found in cookies');
            return NextResponse.json(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        await connectDB();
        console.log('🔗 Database connected');

        // First, get all raw materials created by this user
        console.log('🔍 Finding user raw materials...');
        const userRawMaterials = await RawMaterial.find({ createdBy: userId }).select('_id');
        const userRawMaterialIds = userRawMaterials.map(material => new mongoose.Types.ObjectId(material._id));
        console.log('📄 User raw material IDs:', userRawMaterialIds);

        // Get basic material stats
        const [totalMaterials, activeMaterials] = await Promise.all([
            RawMaterial.countDocuments({ createdBy: userId }),
            RawMaterial.countDocuments({ createdBy: userId, isActive: true })
        ]);

        console.log('📊 Material stats:', { totalMaterials, activeMaterials });

        let totalOrders = 0;
        let pendingOrders = 0;
        let deliveredOrders = 0;
        let totalRevenue = 0;

        if (userRawMaterialIds.length > 0) {
            console.log('🔍 Calculating order stats...');
            
            // Count orders containing user's raw materials
            const orderStats = await Order.aggregate([
                {
                    $match: {
                        'items.rawMaterial': { $in: userRawMaterialIds }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        pendingOrders: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'processing'] }, 1, 0]
                            }
                        },
                        deliveredOrders: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0]
                            }
                        }
                    }
                }
            ]);

            if (orderStats.length > 0) {
                totalOrders = orderStats[0].totalOrders;
                pendingOrders = orderStats[0].pendingOrders;
                deliveredOrders = orderStats[0].deliveredOrders;
            }

            console.log('📊 Order counts:', { totalOrders, pendingOrders, deliveredOrders });

            // Calculate revenue from delivered orders with completed payment
            console.log('💰 Calculating revenue...');
            const revenueStats = await Order.aggregate([
                {
                    $match: {
                        'items.rawMaterial': { $in: userRawMaterialIds },
                        status: 'delivered',
                        paymentStatus: 'completed'
                    }
                },
                { $unwind: '$items' },
                {
                    $match: {
                        'items.rawMaterial': { $in: userRawMaterialIds }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                        count: { $sum: 1 }
                    }
                }
            ]);

            if (revenueStats.length > 0) {
                totalRevenue = revenueStats[0].total || 0;
                console.log('💰 Revenue calculation result:', revenueStats[0]);
            } else {
                console.log('💰 No revenue data found');
                
                // Try simpler calculation - all orders regardless of status for demo
                const allOrderRevenue = await Order.aggregate([
                    {
                        $match: {
                            'items.rawMaterial': { $in: userRawMaterialIds }
                        }
                    },
                    { $unwind: '$items' },
                    {
                        $match: {
                            'items.rawMaterial': { $in: userRawMaterialIds }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                            count: { $sum: 1 }
                        }
                    }
                ]);
                
                if (allOrderRevenue.length > 0) {
                    totalRevenue = allOrderRevenue[0].total || 0;
                    console.log('💰 All orders revenue (demo):', allOrderRevenue[0]);
                }
            }
        } else {
            console.log('⚠️ No raw materials found for user');
        }

        const stats = {
            totalMaterials,
            activeMaterials,
            totalOrders,
            pendingOrders,
            deliveredOrders,
            totalRevenue
        };

        console.log('✅ Final stats:', stats);

        return NextResponse.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('❌ Dashboard stats error:', error);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ Error name:', error.name);
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to fetch dashboard stats',
                details: error.message,
                errorType: error.name || 'UnknownError'
            },
            { status: 500 }
        );
    }
}
