// app/api/user/dashboard-stats/route.js
import connectDB from '@/lib/mongodb';
import RawMaterial from '@/models/rawMaterial';
import Order from '@/models/order';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Get user session from cookie
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        await connectDB();

        // Get stats for this user - We need to find orders that contain materials created by this user
        const userMaterials = await RawMaterial.find({ createdBy: userId }).select('_id');
        const userMaterialIds = userMaterials.map(m => m._id);

        const [
            totalMaterials,
            activeMaterials,
            totalOrders,
            pendingOrders,
            totalRevenue
        ] = await Promise.all([
            RawMaterial.countDocuments({ createdBy: userId }),
            RawMaterial.countDocuments({ createdBy: userId, isActive: true }),
            Order.countDocuments({ 'items.rawMaterial': { $in: userMaterialIds } }),
            Order.countDocuments({ 'items.rawMaterial': { $in: userMaterialIds }, status: 'pending' }),
            Order.aggregate([
                { $match: { 'items.rawMaterial': { $in: userMaterialIds }, status: 'completed' } },
                { $unwind: '$items' },
                { $match: { 'items.rawMaterial': { $in: userMaterialIds } } },
                { $group: { _id: null, total: { $sum: { $multiply: ['$items.quantity', '$items.price'] } } } }
            ])
        ]);

        const stats = {
            totalMaterials,
            activeMaterials,
            totalOrders,
            pendingOrders,
            totalRevenue: totalRevenue[0]?.total || 0
        };

        return NextResponse.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard stats' },
            { status: 500 }
        );
    }
}
