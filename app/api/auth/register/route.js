// app/api/auth/register/route.js
import connectDB from '@/lib/mongodb';
import User from '@/models/user';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { username, email, password, confirmPassword } = await request.json();

        // Input validation
        if (!username?.trim() || !email?.trim() || !password || !confirmPassword) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim().toLowerCase();

        // Username validation
        if (trimmedUsername.length < 3) {
            return NextResponse.json(
                { error: 'Username must be at least 3 characters' },
                { status: 400 }
            );
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            return NextResponse.json(
                { error: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        // Password validation
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            );
        }

        await connectDB();

        // Check for existing user with optimized query
        const existingUser = await User.findOne({ email: trimmedEmail })
            .select('_id')
            .lean();
        
        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Create user
        const user = await User.create({
            name: trimmedUsername,
            email: trimmedEmail,
            password,
            phone: '',
            businessAddress: '',
            lastLogin: new Date()
        });

        // Set authentication cookie for auto-login
        const cookieStore = await cookies();
        cookieStore.set('userId', user._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
            sameSite: 'strict'
        });

        // Return success response
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            businessAddress: user.businessAddress || ''
        };

        return NextResponse.json({
            success: true,
            message: 'Account created successfully',
            user: userData,
            autoLogin: true
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return NextResponse.json(
                { error: validationErrors.join(', ') },
                { status: 400 }
            );
        }
        
        // Handle MongoDB network errors
        if (error.name === 'MongoNetworkError') {
            return NextResponse.json(
                { error: 'Database connection error. Please try again.' },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}