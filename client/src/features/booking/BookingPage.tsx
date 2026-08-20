import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button, ButtonLink } from '@/components/ui/Button';
import { LoadingStudio } from '@/components/ui/StudioStates';
import { AmbientBackdrop } from '@/components/motion/Backdrop';
import { getApiErrorMessage } from '@/lib/api';
import { EASE_EXPO } from '@/lib/motion';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  createPaymentOrder,
  createRegistration,
  fetchBookingConfig,
  fetchBookingWorkshop,
  loadRazorpayScript,
  verifyPayment,
  type BookingWorkshop,
  type RegistrationDraft,
} from '@/services/booking.service';

const schema = z.object({
  fullName: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email(),
  phone: z.string().trim().min(10, 'WhatsApp number is required'),
  company: z.string().trim().min(2, 'Business name is required'),
  city: z.string().trim().min(2, 'City is required'),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type Step = 'workshop' | 'details' | 'review' | 'pay' | 'done';

const STEP_LABELS = ['Seat', 'Details', 'Review', 'Pay', 'Done'] as const;

export function BookingPage() {
  const [step, setStep] = useState<Step>('workshop');
  const [workshop, setWorkshop] = useState<BookingWorkshop | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [registration, setRegistration] = useState<RegistrationDraft | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    Promise.all([fetchBookingConfig(), fetchBookingWorkshop()])
      .then(([config, active]) => {
        setEnabled(config.enabled);
        setWorkshop(active);
      })
      .catch((error) => toast.error(getApiErrorMessage(error, 'Unable to load this workshop right now.')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingStudio label="Preparing checkout" />;

  if (!workshop) {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <AmbientBackdrop />
        <div>
          <h1 className="font-display text-display-sm font-bold">Registration is closed</h1>
          <p className="mt-3 text-mist">There is no open batch at the moment.</p>
          <ButtonLink to="/" className="mt-6" variant="secondary">
            Back to the workshop
          </ButtonLink>
        </div>
      </main>
    );
  }

  async function onDetails(values: FormValues) {
    if (!workshop) return;
    try {
      const result = await createRegistration({ ...values, workshopId: workshop.id });
      setRegistration(result.registration);
      setStep('review');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not start registration.'));
    }
  }

  async function pay() {
    if (!registration) return;
    if (!enabled) {
      toast.error('Payment is being configured. Please WhatsApp the team to hold a seat.');
      return;
    }
    setPaying(true);
    try {
      await loadRazorpayScript();
      const order = await createPaymentOrder(registration.registrationCode);
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.order.amount,
        currency: order.order.currency,
        name: order.branding.name,
        description: order.branding.description,
        image: order.branding.image,
        order_id: order.order.id,
        prefill: order.prefill,
        theme: { color: '#EA580C' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verified = await verifyPayment({
              registrationCode: registration.registrationCode,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setRegistration(verified.registration);
            setStep('done');
          } catch (error) {
            toast.error(getApiErrorMessage(error, 'Payment could not be confirmed yet.'));
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      checkout.open();
    } catch (error) {
      setPaying(false);
      toast.error(getApiErrorMessage(error, 'Could not open payment.'));
    }
  }

  const steps: Step[] = ['workshop', 'details', 'review', 'pay', 'done'];
  const currentIndex = steps.indexOf(step);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <main className="relative min-h-screen pb-24 pt-10">
      <AmbientBackdrop />
      <div className="shell max-w-2xl">
        <BrandMark linkToHome />
        <p className="mt-6 label-mono">Secure your seat</p>
        <h1 className="mt-2 font-display text-display-xs font-bold sm:text-display-sm">Booking flow</h1>

        <div className="mt-8">
          <div className="h-1 overflow-hidden rounded-full bg-ink-700">
            <motion.div
              className="h-full bg-ember-sweep"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: EASE_EXPO }}
            />
          </div>
          <ol className="mt-4 flex justify-between gap-1">
            {STEP_LABELS.map((label, index) => {
              const done = currentIndex > index;
              const active = currentIndex === index;
              return (
                <li key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full font-mono text-[0.65rem] transition ${
                      done ? 'bg-ember-sweep text-ink' : active ? 'border border-ember-400 text-ember-300' : 'border border-line text-mist-faint'
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <span className={`hidden font-mono text-[0.58rem] uppercase tracking-wider sm:block ${active ? 'text-ember-300' : 'text-mist-faint'}`}>
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EASE_EXPO }}
            className="mt-8"
          >
            {step === 'workshop' ? (
              <section className="panel gradient-border rounded-3xl p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold">{workshop.name}</h2>
                <p className="mt-1 text-mist">
                  {workshop.batchName} · {formatDate(workshop.startDate)}
                </p>
                <p className="mt-6 font-display text-5xl font-extrabold tabular sm:text-6xl">
                  {formatCurrency(workshop.pricing.currentPrice, workshop.pricing.currencySymbol)}
                </p>
                <p className="mt-2 text-sm text-mist">
                  {workshop.seatsAvailable} of {workshop.capacity} seats remaining
                </p>
                <ul className="mt-6 space-y-2 text-sm text-mist">
                  {workshop.inclusions.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-ember-400">→</span> {item}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full sm:w-auto" onClick={() => setStep('details')}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </section>
            ) : null}

            {step === 'details' ? (
              <form className="panel rounded-3xl p-6 sm:p-8" onSubmit={form.handleSubmit(onDetails)}>
                <h2 className="font-display text-2xl font-bold">Your details</h2>
                <p className="mt-1 text-sm text-mist">We use this to confirm your seat and send joining details.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      ['fullName', 'Full name', 'text'],
                      ['email', 'Email', 'email'],
                      ['phone', 'WhatsApp number', 'tel'],
                      ['company', 'Business name', 'text'],
                      ['city', 'City', 'text'],
                    ] as const
                  ).map(([name, label, type]) => (
                    <label key={name} className={`block text-sm ${name === 'fullName' || name === 'company' ? 'sm:col-span-1' : ''}`}>
                      <span className="label-mono text-mist-muted">{label}</span>
                      <input
                        type={type}
                        className="mt-2 w-full rounded-xl border border-line bg-ink/80 px-4 py-3 outline-none transition focus:border-royal-400 focus:ring-1 focus:ring-royal-400/30"
                        {...form.register(name)}
                      />
                      {form.formState.errors[name] ? (
                        <span className="mt-1 block text-xs text-ember-400">{form.formState.errors[name]?.message}</span>
                      ) : null}
                    </label>
                  ))}
                </div>
                <label className="mt-4 block text-sm">
                  <span className="label-mono text-mist-muted">Anything we should know</span>
                  <textarea className="mt-2 w-full rounded-xl border border-line bg-ink/80 px-4 py-3 outline-none focus:border-royal-400" rows={3} {...form.register('notes')} />
                </label>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button type="button" variant="secondary" onClick={() => setStep('workshop')}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" className="sm:flex-1">
                    Review details
                  </Button>
                </div>
              </form>
            ) : null}

            {step === 'review' && registration ? (
              <section className="panel rounded-3xl p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold">Review</h2>
                <dl className="mt-6 divide-y divide-line rounded-xl border border-line">
                  {[
                    ['Name', registration.fullName],
                    ['Email', registration.email],
                    ['Workshop', registration.workshopName],
                    ['Amount', formatCurrency(registration.amount, registration.currencySymbol)],
                    ['ID', registration.registrationCode],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                      <dt className="text-mist-muted">{label}</dt>
                      <dd className={`text-right font-medium ${label === 'ID' ? 'font-mono text-ember-300' : ''}`}>{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button variant="secondary" onClick={() => setStep('details')}>
                    Edit
                  </Button>
                  <Button onClick={pay} disabled={paying} className="sm:flex-1">
                    {paying ? 'Opening payment…' : 'Pay securely'}
                  </Button>
                </div>
              </section>
            ) : null}

            {step === 'done' && registration ? (
              <section className="panel gradient-border rounded-3xl p-8 text-center sm:p-12">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ember-sweep text-ink">
                    <Check className="h-8 w-8" />
                  </span>
                </motion.div>
                <p className="mt-6 label-mono text-ember-300">Seat confirmed</p>
                <h2 className="mt-2 font-display text-display-sm font-bold">You’re in.</h2>
                <p className="mt-4 font-mono text-xl text-ember-300">{registration.registrationCode}</p>
                <p className="mt-4 text-sm text-mist">Confirmation will follow on email / WhatsApp with joining details.</p>
                <ButtonLink to="/" variant="secondary" className="mt-8">
                  Back to the workshop
                </ButtonLink>
              </section>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
