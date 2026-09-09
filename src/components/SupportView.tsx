import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface SupportViewProps {
  onOpenLiveChat: () => void;
}

export const SupportView: React.FC<SupportViewProps> = ({ onOpenLiveChat }) => {
  const { t, isTelugu } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Booking Issue');
  const [message, setMessage] = useState('');

  const [sentSuccess, setSentSuccess] = useState(false);
  const [showFaqs, setShowFaqs] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = isTelugu
    ? [
        {
          q: 'అపాయింట్‌మెంట్‌ను ఎలా రీషెడ్యూల్ చేయాలి?',
          a: 'మీ బుకింగ్స్ ట్యాబ్‌కు వెళ్లి, అపాయింట్‌మెంట్‌ను ఎంచుకోండి లేదా రీషెడ్యూల్ చేయండి. సమయానికి 4 గంటల ముందు వరకు అదనపు రుసుము లేకుండా వేరే సమయాన్ని ఎంచుకోవచ్చు.',
        },
        {
          q: 'శ్రీ సంకల్ప హాస్పిటల్ బుకింగ్ లో ఏ చెల్లింపు విధానాలు అందుబాటులో ఉన్నాయి?',
          a: 'UPI (GPay, PhonePe, Paytm, BHIM), క్రెడిట్/డెబిట్ కార్డులు మరియు ఆసుపత్రి రిసెప్షన్ కౌంటర్ వద్ద నేరుగా చెల్లింపులు అందుబాటులో ఉన్నాయి.',
        },
        {
          q: 'మెడికల్ రికార్డులను ఎలా అప్‌లోడ్ చేయాలి?',
          a: 'ప్రొఫైల్ & మెడికల్ రికార్డ్స్ ట్యాబ్‌కు వెళ్లి "రికార్డులు అప్‌లోడ్" క్లిక్ చేసి మీ PDF లేదా ఫోటోలను భద్రపరుచుకోవచ్చు.',
        },
        {
          q: 'అపాయింట్‌మెంట్ రద్దు చేస్తే రీఫండ్ లభిస్తుందా?',
          a: 'అవును, అపాయింట్‌మెంట్‌కు కనీసం 2 గంటల ముందు రద్దు చేస్తే పూర్తి రీఫండ్ చెల్లించబడుతుంది.',
        },
      ]
    : [
        {
          q: 'How do I reschedule an appointment?',
          a: 'Go to your Bookings tab, find the active booking, and click "Reschedule". You can pick a new date or doctor slot without extra charges up to 4 hours before the appointment.',
        },
        {
          q: 'What payment methods are supported?',
          a: 'We accept all major Indian payment methods including UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), and Pay at Hospital reception.',
        },
        {
          q: 'How do I upload and access my medical records?',
          a: 'Navigate to Profile & Medical Records, click "Upload Records", and select your PDF or image files. Once uploaded, your records are safely encrypted and accessible anytime.',
        },
        {
          q: 'Are consultations refundable upon cancellation?',
          a: 'Yes, cancellations made at least 2 hours prior to the scheduled session receive a 100% full refund directly back to your original payment method.',
        },
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-3xl mx-auto py-4 md:py-6 space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Title & Subtitle */}
      <section className="text-center space-y-2">
        <h2 className="font-bold text-3xl md:text-4xl text-primary font-sans">
          {t.supportHeading}
        </h2>
        <p className="text-sm md:text-base text-on-surface-variant max-w-xl mx-auto">
          {t.supportSubheading}
        </p>
      </section>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Form Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high md:row-span-2 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xl text-on-surface mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">mail</span>
              {t.sendMessageTitle}
            </h3>
            <p className="text-xs text-on-surface-variant mb-6">
              {t.replyTimeDesc}
            </p>

            {sentSuccess && (
              <div className="mb-4 p-3 bg-teal-mist/30 border border-teal-mist rounded-xl text-xs text-teal-deep font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                {t.messageSentSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1" htmlFor="name">
                  {t.fullNameLabel}
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isTelugu ? 'మీ పేరు' : 'Your name'}
                  className="w-full bg-sand-soft border-transparent rounded-lg px-4 py-3 text-xs text-on-surface focus:border-secondary focus:ring-0 transition-colors outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1" htmlFor="email">
                  {isTelugu ? 'ఈమెయిల్' : 'Email'}
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-sand-soft border-transparent rounded-lg px-4 py-3 text-xs text-on-surface focus:border-secondary focus:ring-0 transition-colors outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1" htmlFor="topic">
                  {isTelugu ? 'విషయం' : 'Topic'}
                </label>
                <select
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-sand-soft border-transparent rounded-lg px-4 py-3 text-xs text-on-surface focus:border-secondary focus:ring-0 transition-colors outline-none"
                >
                  <option>{isTelugu ? 'బుకింగ్ సమస్య (Booking Issue)' : 'Booking Issue'}</option>
                  <option>{isTelugu ? 'డాక్టర్ సంప్రదింపు (Doctor Consultation)' : 'Doctor Consultation'}</option>
                  <option>{isTelugu ? 'చెల్లింపు & బిల్లింగ్ (Payment & Billing)' : 'Payment & Billing'}</option>
                  <option>{isTelugu ? 'సాధారణ విచారణ (General Inquiry)' : 'General Inquiry'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1" htmlFor="message">
                  {isTelugu ? 'సందేశం' : 'Message'}
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isTelugu ? 'మేము మీకు ఎలా సహాయపడగలము?' : 'How can we help you today?'}
                  className="w-full bg-sand-soft border-transparent rounded-lg px-4 py-3 text-xs text-on-surface focus:border-secondary focus:ring-0 transition-colors resize-none outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-on-primary font-semibold text-xs rounded-lg py-3.5 hover:opacity-90 active:scale-98 transition-all flex justify-center items-center gap-2 mt-2 cursor-pointer shadow-xs"
              >
                {t.sendMessageBtn}
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Live Chat Card */}
          <div
            onClick={onOpenLiveChat}
            className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high hover:bg-teal-mist/10 hover:border-teal-mist transition-all cursor-pointer group shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-on-surface mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">chat_bubble</span>
                  {t.liveChatTitle}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {t.liveChatDesc}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-primary font-semibold text-xs group-hover:underline">
                  {t.startChatBtn} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-secondary-container text-2xl fill">
                  support_agent
                </span>
              </div>
            </div>
          </div>

          {/* Help Center Card */}
          <div
            onClick={() => setShowFaqs(!showFaqs)}
            className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high hover:bg-teal-mist/10 hover:border-teal-mist transition-all cursor-pointer group shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-on-surface mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">help</span>
                  {t.helpCenterTitle}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {t.helpCenterDesc}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-primary font-semibold text-xs group-hover:underline">
                  {showFaqs ? (isTelugu ? 'ప్రశ్నలను దాచండి' : 'Hide FAQs') : (isTelugu ? 'ప్రశ్నలను చూడండి' : 'Visit Help Center')}{' '}
                  <span className="material-symbols-outlined text-sm">
                    {showFaqs ? 'expand_less' : 'arrow_forward'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Contact Details */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-surface-container-high space-y-4">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {t.hospitalHelplineTitle}
            </h4>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-base">
                    call
                  </span>
                </div>
                <div>
                  <p className="text-on-surface-variant">{t.emergency247OpdBooking}</p>
                  <div className="flex flex-wrap gap-2 mt-0.5 font-semibold text-on-surface text-xs">
                    <a href="tel:7095330066" className="text-primary hover:underline">7095330066</a>
                    <span>•</span>
                    <a href="tel:7095330077" className="text-primary hover:underline">7095330077</a>
                    <span>•</span>
                    <a href="tel:8500139123" className="text-primary hover:underline">8500139123</a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-base">
                    location_on
                  </span>
                </div>
                <div>
                  <p className="text-on-surface-variant">{t.hospitalLocationTitle}</p>
                  <p className="text-on-surface font-semibold text-xs leading-relaxed">
                    {t.hospitalLocationDetail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      {showFaqs && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high space-y-3 animate-in fade-in duration-200">
          <h3 className="font-bold text-lg text-primary mb-2">
            {t.faqsTitle}
          </h3>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-surface-variant rounded-xl p-4 transition-colors hover:border-teal-mist"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center text-left text-xs font-semibold text-on-surface"
              >
                <span>{faq.q}</span>
                <span className="material-symbols-outlined text-sm text-outline">
                  {openFaqIndex === idx ? 'remove' : 'add'}
                </span>
              </button>
              {openFaqIndex === idx && (
                <p className="text-xs text-on-surface-variant mt-2 pt-2 border-t border-surface-variant/60 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
