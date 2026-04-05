import { ShieldCheck, Zap, Smartphone, QrCode } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    emoji: "✅",
    title: "Secure Payments",
    desc: "Every transaction is protected. Pay with Chapa (Telebirr, CBE Birr) or Stripe — your money is always safe.",
    color: "bg-green-50 text-green-600",
    border: "border-green-100",
  },
  {
    icon: Zap,
    emoji: "⚡",
    title: "Instant Booking",
    desc: "Reserve your spot in seconds. Real-time queue system ensures fair access — no waiting, no bots.",
    color: "bg-yellow-50 text-yellow-600",
    border: "border-yellow-100",
  },
  {
    icon: Smartphone,
    emoji: "📱",
    title: "Mobile Friendly",
    desc: "Fully optimized for any device. Browse events, buy tickets, and manage everything from your phone.",
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
  },
  {
    icon: QrCode,
    emoji: "🎟️",
    title: "Digital Tickets (QR)",
    desc: "Get your ticket instantly as a QR code. Download it, share it, or scan it at the gate — no printing needed.",
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#026CDF]/10 text-[#026CDF] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Why Ticketr
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Why Choose Us?
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            We built Ticketr to make event ticketing simple, safe, and instant
            for everyone in Ethiopia and beyond.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, emoji, title, desc, color, border }) => (
            <div
              key={title}
              className={`rounded-2xl border ${border} p-6 flex flex-col items-start gap-4 hover:shadow-md transition-shadow`}
            >
              <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1">
                  {emoji} {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div className="mt-12 bg-gray-50 rounded-2xl px-6 py-5 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            SSL Encrypted
          </span>
          <span className="w-px h-4 bg-gray-200 hidden sm:block" />
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Real-time availability
          </span>
          <span className="w-px h-4 bg-gray-200 hidden sm:block" />
          <span className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-500" />
            Works on all devices
          </span>
          <span className="w-px h-4 bg-gray-200 hidden sm:block" />
          <span className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-purple-500" />
            Instant QR delivery
          </span>
        </div>
      </div>
    </section>
  );
}
