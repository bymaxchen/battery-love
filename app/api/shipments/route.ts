import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("Sales");
    
    const body = await request.json();
    const { customerCode, quantity, date } = body;

    // 验证必填字段
    if (!customerCode || !quantity || !date) {
      return NextResponse.json(
        { success: false, message: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 创建出货记录
    const shipment = {
      customerCode,
      quantity: parseInt(quantity),
      date: new Date(date),
      createdAt: new Date(),
    };

    const result = await db.collection("Shipments").insertOne(shipment);
    
    return NextResponse.json({
      success: true,
      message: '出货记录创建成功',
      shipment: { ...shipment, _id: result.insertedId }
    });
  } catch (error) {
    console.error('创建出货记录失败:', error);
    return NextResponse.json(
      { success: false, message: '创建出货记录失败' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("Sales");
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const customerCode = searchParams.get('customerCode');

    // 构建查询条件
    const query: Record<string, unknown> = {};
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }
    if (customerCode) {
      query.customerCode = customerCode;
    }

    // 获取出货记录
    const shipments = await db.collection("Shipments")
      .find(query)
      .sort({ date: -1 })
      .toArray();

    // 获取关联的客户信息
    const customerCodes = [...new Set(shipments.map(shipment => shipment.customerCode))];
    const customers = await db.collection("Customers")
      .find({ code: { $in: customerCodes } })
      .toArray();

    // 将客户信息添加到出货记录中
    const shipmentsWithCustomers = shipments.map(shipment => ({
      ...shipment,
      customer: customers.find(c => c.code === shipment.customerCode)
    }));

    return NextResponse.json({
      success: true,
      shipments: shipmentsWithCustomers,
    });
  } catch (error) {
    console.error('获取出货记录失败:', error);
    return NextResponse.json(
      { success: false, message: '获取出货记录失败' },
      { status: 500 }
    );
  }
} 