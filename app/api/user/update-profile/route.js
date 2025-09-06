// app/api/user/update-profile/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';

export async function PUT(request) {
    try {
        // Check authentication
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        await connectDB();

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Get form data
        const { username, email, stallAddress } = await request.json();

        // Validate input
        if (!username || !email) {
            return NextResponse.json(
                { error: 'Username and email are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        // Check if email is already used by another user
        if (email !== user.email) {
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: userId } 
            });
            
            if (existingUser) {
                return NextResponse.json(
                    { error: 'Email is already in use by another account' },
                    { status: 400 }
                );
            }
        }

        // Update user fields
        user.vendorName = username.trim();
        user.email = email.trim().toLowerCase();
        user.stallAddress = stallAddress ? stallAddress.trim() : '';

        // Save updated user
        await user.save();

        // Return updated user data
        const userData = {
            id: user._id,
            name: user.vendorName,
            vendorName: user.vendorName,
            email: user.email,
            stallAddress: user.stallAddress,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt
        };

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: userData
        });

    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to update profile',
                details: error.message 
            },
            { status: 500 }
        );
    }
}
