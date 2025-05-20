import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Create a new customer
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("Sales");
    
    const customer = await request.json();
    
    const result = await db.collection("Customers").insertOne(customer);
    
    return NextResponse.json({ 
      success: true, 
      customer: { ...customer, _id: result.insertedId } 
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

// Get all customers
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Sales");
    
    const customers = await db.collection("Customers").find({}).toArray();
    
    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// Update a customer
export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("Sales");
    
    const { code, ...updateData } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Customer code is required' },
        { status: 400 }
      );
    }

    const result = await db.collection("Customers").updateOne(
      { code },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
} 