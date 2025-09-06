// app/api/auth/login/route.js
import connectDB from '@/lib/mongodb';
import User from '@/models/user';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Input validation
        if (!email?.trim() || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const trimmedEmail = email.trim().toLowerCase();

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        await connectDB();

        // Find user with optimized query
        const user = await User.findOne({ email: trimmedEmail })
            .select('+password name email phone businessAddress profilePicture')
            .lean(false);
        
        if (!user) {
            console.log('User not found for email:', trimmedEmail);
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await user.comparePassword(password);
        
        if (!isValidPassword) {
            console.log('Invalid password for user:', trimmedEmail);
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Update last login (async, non-blocking)
        User.findByIdAndUpdate(user._id, { lastLogin: new Date() }).exec();

        // Set authentication cookie
        const cookieStore = await cookies();
        cookieStore.set('userId', user._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
            sameSite: 'strict'
        });

        // Return user data
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            businessAddress: user.businessAddress || '',
            profilePicture: user.profilePicture
        };

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            user: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        
        // Handle specific MongoDB errors
        if (error.name === 'MongoNetworkError') {
            return NextResponse.json(
                { error: 'Database connection error. Please try again.' },
                { status: 503 }
            );
        }
        
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { error: 'Invalid input data' },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { error: 'Login failed. Please try again.' },
            { status: 500 }
        );
    }
}