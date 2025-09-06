// app/api/user/rawmaterials/route.js
import connectDB from '@/lib/mongodb';
import RawMaterial from '@/models/rawMaterial';
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

        // Get all raw materials for this user
        const materials = await RawMaterial.find({ createdBy: userId })
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            rawMaterials: materials
        });

    } catch (error) {
        console.error('Get user raw materials error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch raw materials' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
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

        // Handle FormData for file uploads
        const formData = await request.formData();
        
        // Extract form fields
        const materialData = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            originalPrice: parseFloat(formData.get('originalPrice')),
            quantity: parseInt(formData.get('quantity')),
            category: formData.get('category'),
            subcategory: formData.get('subcategory'),
            features: formData.get('features') ? formData.get('features').split(',').map(f => f.trim()).filter(f => f) : [],
            tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()).filter(t => t) : [],
            createdBy: userId
        };

        // Handle image uploads
        const images = [];
        let imageIndex = 0;
        while (formData.get(`image${imageIndex}`)) {
            const file = formData.get(`image${imageIndex}`);
            
            // For now, we'll store a placeholder URL
            // In production, you'd upload to Cloudinary or similar service
            images.push({
                url: `/api/placeholder/image${imageIndex}`,
                alt: materialData.name || 'Raw material image'
            });
            imageIndex++;
        }
        
        materialData.images = images;
        // Set main image (required field)
        if (images.length > 0) {
            materialData.mainImage = images[0].url;
        }

        await connectDB();

        // Create new raw material with user as creator
        const material = await RawMaterial.create(materialData);

        // Populate creator info
        await material.populate('createdBy', 'username email');

        return NextResponse.json({
            success: true,
            message: 'Material added successfully',
            material
        }, { status: 201 });

    } catch (error) {
        console.error('Add raw material error:', error);
        return NextResponse.json(
            { error: 'Failed to add raw material', details: error.message },
            { status: 500 }
        );
    }
}
