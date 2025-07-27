"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  MapPin,
  Truck,
  Info,
  ArrowRight,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import StoreHeader from "../_components/StoreHeader";
import { Progress } from "@/components/ui/progress";

export default function ConfirmationPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  // Generate a random order number
  const orderNumber = Math.floor(
    10000000 + Math.random() * 90000000
  ).toString();

  const orderDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  const deliveryDate = estimatedDelivery.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Sample order items
  const orderItems = [
    {
      id: "1",
      name: "Teen Mindfulness Journal: 90 Days of Emotional Awareness",
      price: 19.99,
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      quantity: 1,
    },
    {
      id: "2",
      name: "Stress Relief Fidget Cube for Anxiety Management",
      price: 14.95,
      image:
        "https://images.unsplash.com/photo-1591017683260-c0cbf29c7c72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      quantity: 2,
    },
  ];

  // Calculate order total
  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-gray-600">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Order #{orderNumber}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Placed on {orderDate}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  <CheckCircle className="h-4 w-4 mr-1" /> Confirmed
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Order Status
              </h3>
              <Progress value={progress} className="h-2 mb-2" />
              <div className="grid grid-cols-4 text-xs">
                <div className="text-emerald-600 font-medium">Confirmed</div>
                <div className="text-center text-gray-500">Processing</div>
                <div className="text-center text-gray-500">Shipped</div>
                <div className="text-right text-gray-500">Delivered</div>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Estimated Delivery
                  </h3>
                  <p className="text-sm text-gray-600">{deliveryDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Shipping Address
                  </h3>
                  <p className="text-sm text-gray-600">
                    John Doe
                    <br />
                    123 Main Street, Apt 4B
                    <br />
                    San Francisco, CA 94103
                    <br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Shipping Method
                  </h3>
                  <p className="text-sm text-gray-600">
                    Standard Shipping (3-5 business days)
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <h3 className="text-base font-medium text-gray-900 mb-4">
              Order Items
            </h3>

            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {item.name}
                    </h4>
                    <div className="mt-1 flex justify-between text-sm">
                      <span className="text-gray-500">Qty {item.quantity}</span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                {shipping === 0 ? (
                  <span className="text-emerald-600 font-medium">Free</span>
                ) : (
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-medium pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                What's Next?
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                You'll receive an email confirmation with your order details and
                tracking information once your package ships. If you have any
                questions about your order, please contact our support team.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link href="/store">
            <Button variant="outline" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/store/orders">
            <Button className="w-full sm:w-auto gap-2">
              View My Orders <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
