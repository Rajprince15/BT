'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import Container from '@/components/common/Container';
import CheckoutStepper, { type CheckoutStep } from '@/components/checkout/CheckoutStepper';
import AddressStep from '@/components/checkout/AddressStep';
import ShippingStep from '@/components/checkout/ShippingStep';
import ReviewStep from '@/components/checkout/ReviewStep';
import OrderSummary from '@/components/checkout/OrderSummary';
import MockRazorpayModal, { type MockRazorpayResult } from '@/components/checkout/MockRazorpayModal';
import { useCart } from '@/hooks/useCart';
import userService from '@/services/user.service';
import checkoutService from '@/services/checkout.service';

interface ShippingSummary {
  id: string;
  label: string;
  eta: string;
  price: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart } = useCart();
  const { data: addresses = [] } = useQuery({
    queryKey: ['addresses'],
    queryFn: userService.addresses.list,
  });

  const [step, setStep] = useState<CheckoutStep>('address');
  const [completed, setCompleted] = useState<CheckoutStep[]>([]);
  const [addressId, setAddressId] = useState<number>();
  const [shipping, setShipping] = useState<ShippingSummary | undefined>();
  const [preparing, setPreparing] = useState(false);
  const [modalState, setModalState] = useState<{ open: boolean; orderId: string; amount: number; currency: string; quoteId: string }>({
    open: false,
    orderId: '',
    amount: 0,
    currency: 'INR',
    quoteId: '',
  });

  useEffect(() => {
    const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0];
    if (defaultAddress && !addressId) setAddressId(defaultAddress.id);
  }, [addresses, addressId]);

  const selectedAddress = useMemo(() => addresses.find((address) => address.id === addressId), [addresses, addressId]);

  if (!cart) {
    return <main data-testid="checkout-loading" className="min-h-[60vh] bg-bg" />;
  }
  if (cart.items.length === 0) {
    return (
      <main data-testid="checkout-empty" className="bg-bg">
        <Container className="grid place-items-center py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Checkout</p>
          <h1 className="mt-3 font-serif text-4xl text-ink">Your cart is empty</h1>
          <a href="/shop" className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-wider2 text-bg hover:bg-gold">
            Continue shopping
          </a>
        </Container>
      </main>
    );
  }

  const markComplete = (id: CheckoutStep) => setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]));

  const goto = (target: CheckoutStep) => {
    if (target === 'shipping' && !addressId) return;
    if (target === 'review' && (!addressId || !shipping)) return;
    setStep(target);
  };

  const beginPayment = async () => {
    if (!addressId || !shipping || !selectedAddress) return;
    setPreparing(true);
    try {
      const quote = await checkoutService.quote({ addressId, paymentMethod: 'razorpay' });
      const order = await checkoutService.createRazorpayOrder({
        quoteId: quote.quoteId,
        amount: quote.total,
        currency: quote.currency,
      });
      setModalState({
        open: true,
        orderId: order.orderId,
        amount: quote.total,
        currency: quote.currency,
        quoteId: quote.quoteId,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to prepare payment');
    } finally {
      setPreparing(false);
    }
  };

  const handleRazorpay = async (result: MockRazorpayResult) => {
    if (result.status === 'cancelled') {
      toast.info('Payment cancelled. Your cart is preserved.');
      return;
    }
    if (result.status === 'failed') {
      toast.error(result.reason);
      return;
    }
    try {
      await checkoutService.verifyPayment({
        orderId: modalState.orderId,
        paymentId: result.paymentId,
        signature: result.signature,
        idempotencyKey: `idem_${modalState.orderId}_${Date.now()}`,
      });
      router.push(`/checkout/success?orderId=${modalState.orderId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Payment could not be verified');
    }
  };

  return (
    <main data-testid="checkout-page" className="bg-bg">
      <Container className="py-12">
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">A considered finish</p>
        <h1 className="mt-2 font-serif text-5xl text-ink">Checkout</h1>

        <div className="mt-8">
          <CheckoutStepper current={step} completed={completed} onNavigate={goto} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            {step === 'address' ? (
              <div className="grid gap-6">
                <AddressStep addresses={addresses} selected={addressId} onSelect={setAddressId} />
                <button
                  type="button"
                  data-testid="checkout-continue-shipping"
                  disabled={!addressId}
                  onClick={() => {
                    markComplete('address');
                    setStep('shipping');
                  }}
                  className="inline-flex h-12 items-center justify-center self-start rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-wider2 text-bg hover:bg-gold disabled:opacity-50"
                >
                  Continue to delivery
                </button>
              </div>
            ) : null}

            {step === 'shipping' ? (
              <div className="grid gap-6">
                <ShippingStep
                  selected={shipping?.id}
                  onSelect={(id, method) => setShipping({ id, ...method })}
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    data-testid="checkout-back-address"
                    onClick={() => setStep('address')}
                    className="h-12 rounded-full border border-border px-5 text-xs font-semibold uppercase tracking-wider2 text-ink hover:border-gold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    data-testid="checkout-continue-review"
                    disabled={!shipping}
                    onClick={() => {
                      markComplete('shipping');
                      setStep('review');
                    }}
                    className="h-12 rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-wider2 text-bg hover:bg-gold disabled:opacity-50"
                  >
                    Continue to review
                  </button>
                </div>
              </div>
            ) : null}

            {step === 'review' && selectedAddress && shipping ? (
              <ReviewStep
                cart={cart}
                address={selectedAddress}
                shipping={shipping}
                onEditAddress={() => setStep('address')}
                onEditShipping={() => setStep('shipping')}
                onPay={beginPayment}
                busy={preparing}
              />
            ) : null}
          </div>

          <OrderSummary cart={cart} />
        </div>
      </Container>

      <MockRazorpayModal
        open={modalState.open}
        onClose={() => setModalState((prev) => ({ ...prev, open: false }))}
        onResult={handleRazorpay}
        amount={modalState.amount}
        currency={modalState.currency}
        orderId={modalState.orderId}
      />
    </main>
  );
}
