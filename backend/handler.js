'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

const PRODUCTS = [
  {
    id: 'rtx-4090',
    name: 'RTX 4090 GPU',
    price: 1599.99,
    originalPrice: 1999.99,
    description: 'Flagship graphics card for ultimate gaming and AI workloads',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1587829191301-f7c7af6c77f8?w=400&h=300&fit=crop',
    discount: 20,
  },
  {
    id: 'macbook-pro-m3',
    name: 'MacBook Pro M3',
    price: 1999.00,
    originalPrice: 2499.00,
    description: 'Powerful laptop with M3 chip for professionals',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    discount: 20,
  },
  {
    id: 'ps5-console',
    name: 'PlayStation 5',
    price: 499.99,
    originalPrice: 649.99,
    description: 'Next-gen gaming console with stunning graphics',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1605901287835-b5f7a80a2d3f?w=400&h=300&fit=crop',
    discount: 23,
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro Max',
    price: 1099.00,
    originalPrice: 1399.00,
    description: 'Latest iPhone with A17 Pro and superior camera system',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1592286927505-1fed6a0ce0e5?w=400&h=300&fit=crop',
    discount: 21,
  },
  {
    id: 'airpods-pro',
    name: 'AirPods Pro (3rd Gen)',
    price: 249.00,
    originalPrice: 349.00,
    description: 'Premium wireless earbuds with active noise cancellation',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1606841838e12-8facc6dcde92?w=400&h=300&fit=crop',
    discount: 29,
  },
  {
    id: 'samsung-qled',
    name: '85" Samsung QLED TV',
    price: 1799.99,
    originalPrice: 2299.99,
    description: '4K QLED television with 144Hz refresh rate',
    stock: 6,
    image: 'https://images.unsplash.com/photo-1593642532400-2682a8a8fca9?w=400&h=300&fit=crop',
    discount: 22,
  },
];

/**
 * Simulates high traffic by introducing random latency
 * @param {number} minMs - Minimum milliseconds to wait
 * @param {number} maxMs - Maximum milliseconds to wait
 */
const simulateTrafficLatency = (minMs = 100, maxMs = 3000) => {
  return new Promise((resolve) => {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    setTimeout(resolve, delay);
  });
};

/**
 * GET /products - Returns list of available products
 */
module.exports.getProducts = async (event, context) => {
  console.log('Fetching products...', JSON.stringify(event));

  try {
    // Simulate high traffic latency
    await simulateTrafficLatency(200, 800);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        message: 'Products retrieved successfully',
        data: PRODUCTS,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

/**
 * POST /orders - Creates a new order
 */
module.exports.createOrder = async (event, context) => {
  console.log('Creating order...', JSON.stringify(event));

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { cart, customerEmail } = body;

    // Validate input
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          success: false,
          message: 'Invalid cart data',
          timestamp: new Date().toISOString(),
        }),
      };
    }

    // Simulate high traffic latency - stronger on order creation
    await simulateTrafficLatency(500, 4000);

    const orderId = uuidv4();
    const createdAt = Date.now();
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Prepare order item for DynamoDB
    const orderItem = {
      orderId,
      createdAt,
      customerEmail: customerEmail || 'anonymous@example.com',
      items: cart,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status: 'CONFIRMED',
      expirationTime: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days TTL
      timestamp: new Date().toISOString(),
    };

    // Write to DynamoDB
    const params = {
      TableName: process.env.ORDERS_TABLE,
      Item: orderItem,
    };

    await dynamodb.put(params).promise();

    console.log('Order created successfully:', orderId);

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        message: 'Order created successfully',
        data: {
          orderId,
          totalAmount: orderItem.totalAmount,
          itemCount: cart.length,
          status: 'CONFIRMED',
          createdAt: new Date(createdAt).toISOString(),
        },
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        message: 'Failed to create order',
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

/**
 * OPTIONS - Handles CORS preflight requests
 */
module.exports.options = async (event, context) => {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
  };
};
