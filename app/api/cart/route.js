// app/api/cart/route.js - FIXED VERSION
import connectDB from '@/lib/mongodb';
import Cart from '@/models/cart';
import RawMaterial from '@/models/rawMaterial';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    console.log('🛒 Cart POST API called');
    await connectDB();
    console.log('🔗 Database connected');
    
    // Check and fix any index issues
    try {
      const cartCollection = Cart.collection;
      const indexes = await cartCollection.indexes();
      console.log('📊 Current indexes:', indexes.map(idx => ({ name: idx.name, key: idx.key })));
      
      // Check if there's a problematic userId index
      const hasUserIdIndex = indexes.some(idx => idx.key.userId !== undefined);
      if (hasUserIdIndex) {
        console.log('🔧 Dropping problematic userId index...');
        try {
          await cartCollection.dropIndex('userId_1');
          console.log('✅ Dropped userId_1 index');
        } catch (dropError) {
          console.log('⚠️ Could not drop userId_1 index:', dropError.message);
        }
      }
    } catch (indexError) {
      console.error('⚠️ Index check error:', indexError.message);
    }
    
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

    const body = await request.json();
    console.log('📦 Request body:', body);
    const { rawMaterialId, quantity } = body;

    if (!rawMaterialId) {
      console.log('❌ No rawMaterialId provided');
      return NextResponse.json(
        { success: false, error: 'Raw Material ID is required' },
        { status: 400 }
      );
    }

    if (!quantity || quantity < 1) {
      console.log('❌ Invalid quantity:', quantity);
      return NextResponse.json(
        { success: false, error: 'Valid quantity is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Looking for raw material:', rawMaterialId);
    // Check if raw material exists and is active
    const rawMaterial = await RawMaterial.findById(rawMaterialId);
    console.log('📄 Raw material found:', !!rawMaterial);
    
    if (!rawMaterial || !rawMaterial.isActive) {
      console.log('❌ Raw material not found or inactive');
      return NextResponse.json(
        { success: false, error: 'Raw material not found or no longer available' },
        { status: 404 }
      );
    }

    if (rawMaterial.quantity < quantity) {
      console.log('❌ Insufficient quantity. Available:', rawMaterial.quantity, 'Requested:', quantity);
      return NextResponse.json(
        { success: false, error: 'Insufficient quantity available' },
        { status: 400 }
      );
    }

    console.log('🛍️ Looking for existing cart for user:', userId);
    let cart = await Cart.findOrCreateForUser(userId);
    console.log('🛍️ Cart found/created:', !!cart);

    const existingItemIndex = cart.items.findIndex(cartItem => 
      cartItem.rawMaterial && cartItem.rawMaterial.toString() === rawMaterialId
    );
    console.log('🔍 Existing item index:', existingItemIndex);

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      console.log('📈 Updating quantity from', cart.items[existingItemIndex].quantity, 'to', newQuantity);
      
      if (newQuantity > rawMaterial.quantity) {
        console.log('❌ Cannot add more items than available');
        return NextResponse.json(
          { success: false, error: 'Cannot add more items than available in stock' },
          { status: 400 }
        );
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      console.log('➕ Adding new item to cart');
      cart.items.push({
        rawMaterial: rawMaterialId,
        quantity
      });
    }

    console.log('💾 Saving cart...');
    await cart.save();
    console.log('✅ Cart saved successfully');

    return NextResponse.json({
      success: true,
      message: 'Raw material added to cart successfully'
    });

  } catch (error) {
    console.error('❌ Cart POST API error:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to add item to cart',
        details: error.message,
        errorType: error.name || 'UnknownError'
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.rawMaterial',
        select: 'name price mainImage quantity isActive',
        match: { isActive: true } // Only get active raw materials
      })
      .lean();

    if (!cart) {
      return NextResponse.json({
        success: true,
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0
        }
      });
    }

    // Filter out items where rawMaterial is null (inactive/deleted materials)
    const validItems = cart.items.filter(item => item.rawMaterial !== null);

    let totalPrice = 0;
    const itemsWithAvailability = validItems.map(item => {
      const itemTotal = item.rawMaterial.price * item.quantity;
      totalPrice += itemTotal;
      
      return {
        ...item,
        availableQuantity: item.rawMaterial.quantity,
        hasStockIssue: item.quantity > item.rawMaterial.quantity
      };
    });

    // If we removed any items, update the cart
    if (validItems.length !== cart.items.length) {
      await Cart.findOneAndUpdate(
        { user: userId },
        { items: validItems.map(item => ({
          rawMaterial: item.rawMaterial._id,
          quantity: item.quantity,
          addedAt: item.addedAt
        })) }
      );
    }

    return NextResponse.json({
      success: true,
      cart: {
        _id: cart._id,
        items: itemsWithAvailability,
        totalItems: validItems.length,
        totalPrice
      }
    });

  } catch (error) {
    console.error('Fetch cart error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch cart',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { rawMaterialId, quantity } = await request.json();

    if (!rawMaterialId || !quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Valid raw material ID and quantity are required' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(item => 
      item.rawMaterial.toString() === rawMaterialId
    );
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    const rawMaterial = await RawMaterial.findById(rawMaterialId);
    if (!rawMaterial || !rawMaterial.isActive || quantity > rawMaterial.quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient quantity available' },
        { status: 400 }
      );
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Return updated cart with populated data
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.rawMaterial',
        select: 'name price mainImage quantity isActive',
        match: { isActive: true }
      })
      .lean();

    // Filter out inactive materials and calculate total
    const validItems = updatedCart.items.filter(item => item.rawMaterial !== null);
    let totalPrice = 0;
    
    const itemsWithAvailability = validItems.map(item => {
      const itemTotal = item.rawMaterial.price * item.quantity;
      totalPrice += itemTotal;
      
      return {
        ...item,
        availableQuantity: item.rawMaterial.quantity,
        hasStockIssue: item.quantity > item.rawMaterial.quantity
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Cart item updated successfully',
      cart: {
        _id: updatedCart._id,
        items: itemsWithAvailability,
        totalItems: validItems.length,
        totalPrice
      }
    });

  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update cart item',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { rawMaterialId } = await request.json();

    if (!rawMaterialId) {
      return NextResponse.json(
        { success: false, error: 'Raw Material ID is required' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter(item => 
      item.rawMaterial.toString() !== rawMaterialId
    );

    await cart.save();

    // Return updated cart with populated data
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.rawMaterial',
        select: 'name price mainImage quantity isActive',
        match: { isActive: true }
      })
      .lean();

    // Filter out inactive materials and calculate total
    const validItems = updatedCart.items.filter(item => item.rawMaterial !== null);
    let totalPrice = 0;
    
    const itemsWithAvailability = validItems.map(item => {
      const itemTotal = item.rawMaterial.price * item.quantity;
      totalPrice += itemTotal;
      
      return {
        ...item,
        availableQuantity: item.rawMaterial.quantity,
        hasStockIssue: item.quantity > item.rawMaterial.quantity
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully',
      cart: {
        _id: updatedCart._id,
        items: itemsWithAvailability,
        totalItems: validItems.length,
        totalPrice
      }
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to remove item from cart',
        details: error.message 
      },
      { status: 500 }
    );
  }
}