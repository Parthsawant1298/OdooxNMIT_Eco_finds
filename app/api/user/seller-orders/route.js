// /api/user/seller-orders/route.js - For sellers to view and manage orders of their products
import connectDB from '@/lib/mongodb';
import RawMaterial from '@/models/rawMaterial';
import Order from '@/models/order';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('📦 Seller orders GET API called');
        
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

        // Get all raw materials created by this user (seller)
        console.log('🔍 Finding user raw materials...');
        const userMaterials = await RawMaterial.find({ createdBy: userId }).select('_id name');
        const userMaterialIds = userMaterials.map(m => m._id);
        console.log('📄 Found materials:', userMaterials.length);

        if (userMaterialIds.length === 0) {
            console.log('⚠️ No materials found for user');
            return NextResponse.json({
                success: true,
                orders: [],
                message: 'No materials found'
            });
        }

        // Find orders containing materials from this seller
        console.log('🔍 Finding orders for user materials...');
        const orders = await Order.findBySellerMaterials(userMaterialIds);
        console.log('📊 Found orders:', orders.length);

        return NextResponse.json({
            success: true,
            orders: orders,
            totalMaterials: userMaterials.length
        });

    } catch (error) {
        console.error('❌ Seller orders error:', error);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ Error name:', error.name);
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to fetch seller orders', 
                details: error.message,
                errorType: error.name || 'UnknownError'
            },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
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

        const { orderId, status } = await request.json();

        if (!orderId || !status) {
            return NextResponse.json(
                { error: 'Order ID and status are required' },
                { status: 400 }
            );
        }

        // Validate status
        const validStatuses = ['processing', 'delivered', 'payment failed'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be one of: processing, delivered, payment failed' },
                { status: 400 }
            );
        }

        await connectDB();

        // Get seller's materials to verify they own products in this order
        const userMaterials = await RawMaterial.find({ createdBy: userId }).select('_id');
        const userMaterialIds = userMaterials.map(m => m._id);

        // Find the order and check if it contains seller's materials
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Verify this seller has products in this order
        const hasSellerProducts = order.containsSellerMaterials(userMaterialIds);
        if (!hasSellerProducts) {
            return NextResponse.json(
                { error: 'You do not have permission to modify this order' },
                { status: 403 }
            );
        }

        // Update order status
        order.status = status;
        await order.save();

        return NextResponse.json({
            success: true,
            message: 'Order status updated successfully',
            order: {
                _id: order._id,
                status: order.status,
                updatedAt: order.updatedAt
            }
        });

    } catch (error) {
        console.error('Update order status error:', error);
        return NextResponse.json(
            { error: 'Failed to update order status', details: error.message },
            { status: 500 }
        );
    }
}