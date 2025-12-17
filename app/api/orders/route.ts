import { connectDB } from "@/lib/db/connection"
import { Order } from "@/lib/db/models/order"
import { Product } from "@/lib/db/models/product"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    await connectDB()

    const body = await request.json()

    const {
      lineItems,
      total,
      subtotal,
      shippingCost,
      customerEmail,
      customerPhone,
      customerFirstName,
      customerLastName,
      shippingAddress,
      billingAddress,
      shippingMethod,
      deliveryNotes,
    } = body

    // Validate required fields
    if (
      !lineItems ||
      !Array.isArray(lineItems) ||
      !customerEmail ||
      !customerFirstName ||
      !customerLastName ||
      !shippingAddress
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify stock and prepare order items
    const orderLineItems = await Promise.all(
      lineItems.map(async (item: any) => {
        const product = await Product.findById(item.productId).lean()
        
        if (!product) {
          throw new Error(`Product ${item.productId} not found`)
        }

        // Find variant and check stock
        const variant = product.variants?.find(
          (v: any) => String(v._id) === item.variantId
        )

        if (!variant) {
          throw new Error(`Variant ${item.variantId} not found for product ${item.productId}`)
        }

        if (variant.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name} ${variant.name}. Available: ${variant.stock}, Requested: ${item.quantity}`
          )
        }

        return {
          productId: item.productId,
          productName: item.productName,
          variantId: item.variantId,
          variantName: item.variantName,
          price: item.price,
          quantity: item.quantity,
          sku: item.sku,
        }
      })
    )

    // Create order
    const order = new Order({
      lineItems: orderLineItems,
      total,
      customerEmail,
      customerPhone,
      customerFirstName,
      customerLastName,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      shippingMethod,
      shippingCost,
      deliveryNotes: deliveryNotes || "",
      paymentStatus: "pending",
      status: "pending",
    })

    const savedOrder = await order.save()

    // Update product stock (reduce by ordered quantity)
    for (const item of orderLineItems) {
      await Product.updateOne(
        { _id: item.productId, "variants._id": item.variantId },
        {
          $inc: { "variants.$.stock": -item.quantity },
        }
      )
    }

    return NextResponse.json(
      {
        message: "Order created successfully",
        orderId: String(savedOrder._id),
        orderNumber: `ORD-${savedOrder._id.toString().slice(-8).toUpperCase()}`,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Order creation error:", error)

    // Handle specific errors
    if (error.message.includes("Insufficient stock")) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      )
    }

    if (error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const email = searchParams.get("email")

    if (orderId) {
      // Fetch specific order by ID
      const order = await Order.findById(orderId).lean()

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        ...order,
        _id: String(order._id),
        orderNumber: `ORD-${order._id.toString().slice(-8).toUpperCase()}`,
      })
    }

    if (email) {
      // Fetch all orders for a customer
      const orders = await Order.find({ customerEmail: email }).lean()

      return NextResponse.json(
        orders.map((order: any) => ({
          ...order,
          _id: String(order._id),
          orderNumber: `ORD-${order._id.toString().slice(-8).toUpperCase()}`,
        }))
      )
    }

    return NextResponse.json(
      { error: "orderId or email parameter required" },
      { status: 400 }
    )
  } catch (error: any) {
    console.error("Order fetch error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
