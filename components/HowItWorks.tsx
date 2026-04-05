import { Search, CreditCard, QrCode, PartyPopper } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Find Your Event",
    desc: "Search by name, category, or location. Browse concerts, sports, comedy, conferences and more.",
    color: "bg-blue-50 text-[#026CDF]",
  },
  {
    step: "02",
    icon: CreditCard,
    title: "Book Your Ticket",
    desc: "Join the queue and pay securely via Chapa (Telebirr, CBE Birr) or Stripe. Takes under 60 seconds.",
    color: "bg-green-50 text-green-600",
  },
  {
    step: "03",
    icon: QrCode,
    title: "Get Your QR Ticket",
    desc: "Receive your digital ticket instantly. Download the QR code and save it to your phone.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    step: "04",
    icon: PartyPopper,
    title: "Enjoy the Event",
    desc: "Show your QR code at the gate. Fast scan, instant entry — no printing, no hassle.",
    color: "bg-orange-50 text-orange-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#026CDF]/10 text-[#026CDF] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
            From discovery to entry — booking a ticket takes less than a minute.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gray-200 z-0" />

          {steps.map(({ step, icon: Icon, title, desc, color }, i) => (
            <div key={step} className="relative z-10 flex flex-col items-center text-center">
              {/* Step number + icon */}
              <div className="relative mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ${color} border border-white`}>
                  <Icon className="w-7 h-7" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#026CDF] text-white text-xs font-extrabold rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
