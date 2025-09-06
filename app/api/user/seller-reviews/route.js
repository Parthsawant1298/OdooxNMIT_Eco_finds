// /api/user/seller-reviews/route.js - Get all reviews for seller's products
import connectDB from '@/lib/mongodb';
import Review from '@/models/review';
import RawMaterial from '@/models/rawMaterial';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('📊 Seller reviews GET API called');
        
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

        // Get all reviews for materials created by this user (seller)
        console.log('🔍 Fetching reviews for seller:', userId);
        const reviews = await Review.find({
            sellerId: userId,
            isActive: true
        })
        .populate('userId', 'name vendorName')
        .populate('rawMaterialId', 'name mainImage')
        .sort({ createdAt: -1 })
        .lean();

        console.log('📊 Found reviews:', reviews.length);
        console.log('📊 Sample review:', reviews[0]);

        // Calculate review statistics
        const stats = {
            totalReviews: reviews.length,
            averageRating: 0,
            ratingBreakdown: {
                5: 0, 4: 0, 3: 0, 2: 0, 1: 0
            }
        };

        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            stats.averageRating = parseFloat((totalRating / reviews.length).toFixed(1));

            // Calculate rating breakdown
            reviews.forEach(review => {
                stats.ratingBreakdown[review.rating]++;
            });
        }

        console.log('📊 Review stats:', stats);

        return NextResponse.json({
            success: true,
            reviews,
            stats
        });

    } catch (error) {
        console.error('❌ Get seller reviews error:', error);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ Error name:', error.name);
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to fetch seller reviews', 
                details: error.message,
                errorType: error.name || 'UnknownError'
            },
            { status: 500 }
        );
    }
}