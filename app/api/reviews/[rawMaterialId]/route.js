// /api/reviews/[rawMaterialId]/route.js - Review system for raw materials
import connectDB from '@/lib/mongodb';
import Review from '@/models/review';
import RawMaterial from '@/models/rawMaterial';
import Order from '@/models/order';
import User from '@/models/user';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET reviews for a specific raw material
export async function GET(request, { params }) {
    try {
        console.log('📖 Get reviews API called');
        await connectDB();
        console.log('🔗 Database connected');
        
        const { rawMaterialId } = await params;
        console.log('📦 Raw Material ID:', rawMaterialId);

        // Get all active reviews for this raw material
        const reviews = await Review.find({
            rawMaterialId,
            isActive: true
        })
        .populate('userId', 'name vendorName profilePicture')
        .sort({ createdAt: -1 })
        .lean();

        console.log('📊 Found reviews:', reviews.length);
        console.log('📊 Sample review:', reviews[0]);

        // Format reviews with consistent user data
        const formattedReviews = reviews.map(review => ({
            ...review,
            userName: review.userName || review.userId?.name || review.userId?.vendorName || 'Anonymous User',
            userProfilePicture: review.userId?.profilePicture || null
        }));

        return NextResponse.json({
            success: true,
            reviews: formattedReviews
        });

    } catch (error) {
        console.error('❌ Get reviews error:', error);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ Error name:', error.name);
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to fetch reviews', 
                details: error.message,
                errorType: error.name || 'UnknownError'
            },
            { status: 500 }
        );
    }
}

// POST new review for a raw material
export async function POST(request, { params }) {
    try {
        console.log('📝 Review POST API called');
        
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

        const { rawMaterialId } = await params;
        const { rating, title, comment } = await request.json();

        console.log('📦 Request data:', { rawMaterialId, rating, title, comment });

        // Validate input
        if (!rating || !comment) {
            console.log('❌ Missing rating or comment');
            return NextResponse.json(
                { success: false, error: 'Rating and comment are required' },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            console.log('❌ Invalid rating:', rating);
            return NextResponse.json(
                { success: false, error: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        if (comment.length < 10) {
            console.log('❌ Comment too short:', comment.length);
            return NextResponse.json(
                { success: false, error: 'Comment must be at least 10 characters long' },
                { status: 400 }
            );
        }

        await connectDB();
        console.log('🔗 Database connected');

        // Get raw material and user details
        console.log('🔍 Looking for raw material and user...');
        const [rawMaterial, user] = await Promise.all([
            RawMaterial.findById(rawMaterialId).populate('createdBy', 'name vendorName'),
            User.findById(userId).select('name vendorName')
        ]);

        if (!rawMaterial) {
            console.log('❌ Raw material not found:', rawMaterialId);
            return NextResponse.json(
                { success: false, error: 'Raw material not found' },
                { status: 404 }
            );
        }

        if (!user) {
            console.log('❌ User not found:', userId);
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        console.log('✅ Raw material and user found');
        console.log('📄 Raw material:', { id: rawMaterial._id, name: rawMaterial.name, seller: rawMaterial.createdBy.name || rawMaterial.createdBy.vendorName });
        console.log('👤 User:', { id: user._id, name: user.name || user.vendorName });

        // Check if user has purchased this raw material (optional verification)
        const hasPurchased = await Order.findOne({
            user: userId,
            'items.rawMaterial': rawMaterialId,
            paymentStatus: 'completed'
        });

        // For demo purposes, we'll allow reviews without purchase verification
        // In production, you might want to enforce this
        // if (!hasPurchased) {
        //     return NextResponse.json(
        //         { error: 'You can only review products you have purchased' },
        //         { status: 403 }
        //     );
        // }

        // Check if user has already reviewed this material
        console.log('🔍 Checking for existing review...');
        const existingReview = await Review.findOne({
            userId,
            rawMaterialId,
            isActive: true
        });

        if (existingReview) {
            console.log('❌ User has already reviewed this material');
            return NextResponse.json(
                { success: false, error: 'You have already reviewed this product' },
                { status: 409 }
            );
        }

        // Create new review
        console.log('💾 Creating new review...');
        const review = await Review.create({
            userId,
            userName: user.name || user.vendorName || 'Anonymous User',
            rawMaterialId,
            rawMaterialName: rawMaterial.name,
            sellerId: rawMaterial.createdBy._id,
            sellerName: rawMaterial.createdBy.name || rawMaterial.createdBy.vendorName || rawMaterial.createdBy.supplierName,
            rating: parseInt(rating),
            title: title || '',
            comment,
            isActive: true
        });

        console.log('✅ Review created successfully');

        // Update raw material ratings
        console.log('📊 Updating raw material ratings...');
        const { averageRating, numReviews } = await Review.getAverageRating(rawMaterialId);
        await RawMaterial.findByIdAndUpdate(rawMaterialId, {
            ratings: averageRating,
            numReviews
        });

        console.log('✅ Raw material ratings updated:', { averageRating, numReviews });

        // Populate user details for response
        await review.populate('userId', 'name vendorName profilePicture');

        return NextResponse.json({
            success: true,
            message: 'Review added successfully',
            review: {
                ...review.toObject(),
                userName: review.userName || review.userId?.name || review.userId?.vendorName || 'Anonymous User',
                userProfilePicture: review.userId?.profilePicture || null
            }
        }, { status: 201 });

    } catch (error) {
        console.error('❌ Add review error:', error);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ Error name:', error.name);
        
        if (error.code === 11000) {
            console.log('❌ Duplicate review detected');
            return NextResponse.json(
                { success: false, error: 'You have already reviewed this product' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to add review', 
                details: error.message,
                errorType: error.name || 'UnknownError'
            },
            { status: 500 }
        );
    }
}