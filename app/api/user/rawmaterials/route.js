// app/api/user/rawmaterials/route.js
import connectDB from '@/lib/mongodb';
import RawMaterial from '@/models/rawMaterial';
import User from '@/models/user';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload image to Cloudinary
async function uploadToCloudinary(file) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'ecofinds/raw-materials',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

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
            .populate('createdBy', 'name email')
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

        let materialData;
        try {
            // Check if request is FormData or JSON
            const contentType = request.headers.get('content-type');
            
            if (contentType && contentType.includes('multipart/form-data')) {
                // Handle FormData
                const formData = await request.formData();
                materialData = {};
                
                // Extract text fields and convert types
                for (const [key, value] of formData.entries()) {
                    if (!key.startsWith('image')) {
                        // Convert numeric fields
                        if (key === 'price' || key === 'originalPrice' || key === 'quantity' || key === 'discount') {
                            materialData[key] = parseFloat(value) || 0;
                        }
                        // Handle arrays (features, tags)
                        else if (key === 'features' || key === 'tags') {
                            try {
                                materialData[key] = JSON.parse(value);
                            } catch {
                                materialData[key] = value ? [value] : [];
                            }
                        }
                        // Regular string fields
                        else {
                            materialData[key] = value;
                        }
                    }
                }
                
                // Handle image files and upload to Cloudinary
                const imageFiles = [];
                for (const [key, value] of formData.entries()) {
                    if (key.startsWith('image') && value instanceof File) {
                        imageFiles.push(value);
                    }
                }

                // Upload images to Cloudinary
                const uploadedImages = [];
                for (const file of imageFiles) {
                    try {
                        const result = await uploadToCloudinary(file);
                        uploadedImages.push({
                            url: result.secure_url,
                            alt: materialData.name || 'Raw material image'
                        });
                    } catch (uploadError) {
                        console.error('Image upload failed:', uploadError);
                        return NextResponse.json(
                            { error: 'Failed to upload image. Please try again.' },
                            { status: 500 }
                        );
                    }
                }

                // Set images and mainImage
                if (uploadedImages.length > 0) {
                    materialData.images = uploadedImages;
                    materialData.mainImage = uploadedImages[0].url;
                } else {
                    return NextResponse.json(
                        { error: 'At least one image is required' },
                        { status: 400 }
                    );
                }
                
            } else {
                // Handle JSON
                materialData = await request.json();
            }
        } catch (parseError) {
            console.error('Data parsing error:', parseError);
            return NextResponse.json(
                { error: 'Invalid data format provided' },
                { status: 400 }
            );
        }

        // Validate required fields
        if (!materialData || typeof materialData !== 'object') {
            return NextResponse.json(
                { error: 'Invalid material data' },
                { status: 400 }
            );
        }

        // Check required fields
        const requiredFields = ['name', 'description', 'price', 'quantity', 'category'];
        const missingFields = requiredFields.filter(field => !materialData[field]);
        
        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Ensure numeric fields are valid
        if (isNaN(materialData.price) || materialData.price < 0) {
            return NextResponse.json(
                { error: 'Price must be a valid positive number' },
                { status: 400 }
            );
        }

        if (isNaN(materialData.quantity) || materialData.quantity < 0) {
            return NextResponse.json(
                { error: 'Quantity must be a valid non-negative number' },
                { status: 400 }
            );
        }

        await connectDB();

        // Log the material data for debugging
        console.log('Material data received:', materialData);
        console.log('User ID:', userId);

        // Create new raw material with user as creator
        const material = await RawMaterial.create({
            ...materialData,
            createdBy: userId
        });

        // Populate creator info
        await material.populate('createdBy', 'name email');

        return NextResponse.json({
            success: true,
            message: 'Material added successfully',
            material
        }, { status: 201 });

    } catch (error) {
        console.error('Add raw material error:', error);
        
        // Provide more specific error messages
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return NextResponse.json(
                { error: 'Validation failed', details: validationErrors },
                { status: 400 }
            );
        }
        
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'Duplicate entry detected' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to add raw material', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
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

        // Get material ID from query params
        const { searchParams } = new URL(request.url);
        const materialId = searchParams.get('id');

        if (!materialId) {
            return NextResponse.json(
                { error: 'Material ID is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Find and delete the raw material, but only if it belongs to the current user
        const deletedMaterial = await RawMaterial.findOneAndDelete({
            _id: materialId,
            createdBy: userId
        });

        if (!deletedMaterial) {
            return NextResponse.json(
                { error: 'Raw material not found or you do not have permission to delete it' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Raw material deleted successfully'
        });

    } catch (error) {
        console.error('Delete raw material error:', error);
        return NextResponse.json(
            { error: 'Failed to delete raw material', details: error.message },
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

        const { searchParams } = new URL(request.url);
        const materialId = searchParams.get('id');

        if (!materialId) {
            return NextResponse.json(
                { error: 'Material ID is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if material exists and belongs to user
        const existingMaterial = await RawMaterial.findOne({
            _id: materialId,
            createdBy: userId
        });

        if (!existingMaterial) {
            return NextResponse.json(
                { error: 'Raw material not found or you do not have permission to edit it' },
                { status: 404 }
            );
        }

        // Parse form data (same as POST method)
        const formData = await request.formData();
        const materialData = {};

        // Extract text fields
        const textFields = [
            'name', 'description', 'price', 'originalPrice', 'quantity',
            'category', 'subcategory', 'features', 'tags', 'specifications',
            'origin', 'certifications', 'storageConditions', 'shelfLife'
        ];

        textFields.forEach(field => {
            const value = formData.get(field);
            if (value !== null && value !== '') {
                if (field === 'price' || field === 'originalPrice' || field === 'quantity') {
                    materialData[field] = parseFloat(value) || 0;
                } else if (field === 'features' || field === 'tags') {
                    materialData[field] = value.split(',').map(item => item.trim()).filter(Boolean);
                } else {
                    materialData[field] = value;
                }
            }
        });

        // Handle image updates
        const images = [];
        let imageIndex = 0;
        while (formData.get(`image${imageIndex}`)) {
            const file = formData.get(`image${imageIndex}`);
            
            if (file && file.size > 0) {
                // Convert file to base64 for simple storage
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const base64 = buffer.toString('base64');
                const mimeType = file.type || 'image/jpeg';
                const imageUrl = `data:${mimeType};base64,${base64}`;
                
                images.push({
                    url: imageUrl,
                    alt: materialData.name || existingMaterial.name
                });
            }
            imageIndex++;
        }

        // Only update images if new ones were provided
        if (images.length > 0) {
            materialData.images = images;
            materialData.mainImage = images[0].url;
        }

        // Calculate discount if both prices are provided
        if (materialData.originalPrice && materialData.price) {
            const originalPrice = materialData.originalPrice;
            const currentPrice = materialData.price;
            if (originalPrice > currentPrice) {
                materialData.discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
            } else {
                materialData.discount = 0;
            }
        }

        // Update the material
        const updatedMaterial = await RawMaterial.findByIdAndUpdate(
            materialId,
            { ...materialData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        // Populate creator info
        await updatedMaterial.populate('createdBy', 'name email');

        return NextResponse.json({
            success: true,
            message: 'Material updated successfully',
            rawMaterial: updatedMaterial
        });

    } catch (error) {
        console.error('Update raw material error:', error);
        return NextResponse.json(
            { error: 'Failed to update raw material', details: error.message },
            { status: 500 }
        );
    }
}
