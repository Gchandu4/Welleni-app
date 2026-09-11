import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface PlayStoreStudioViewProps {
  onBack: () => void;
}

export const PlayStoreStudioView: React.FC<PlayStoreStudioViewProps> = ({ onBack }) => {
  const { isTelugu } = useLanguage();
  const [activeTab, setActiveTab] = useState<'visual' | 'screenshots' | 'metadata'>('visual');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Hidden canvases for full-res generation
  const iconCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const featureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ss1CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ss2CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ss3CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ss4CanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Preview URLs
  const [iconUrl, setIconUrl] = useState<string>('');
  const [featureUrl, setFeatureUrl] = useState<string>('');
  const [ss1Url, setSs1Url] = useState<string>('');
  const [ss2Url, setSs2Url] = useState<string>('');
  const [ss3Url, setSs3Url] = useState<string>('');
  const [ss4Url, setSs4Url] = useState<string>('');

  // 1. Draw App Icon (512 x 512 px)
  const drawIcon = () => {
    const canvas = iconCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 512;
    canvas.height = 512;

    // Background: Rich emerald-teal gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 512, 512);
    bgGrad.addColorStop(0, '#004D40');
    bgGrad.addColorStop(0.5, '#006A60');
    bgGrad.addColorStop(1, '#00332C');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle decorative radial glow
    const radial = ctx.createRadialGradient(256, 200, 10, 256, 200, 240);
    radial.addColorStop(0, 'rgba(45, 212, 191, 0.28)');
    radial.addColorStop(1, 'rgba(0, 77, 64, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 512, 512);

    // Outer soft circular ring
    ctx.beginPath();
    ctx.arc(256, 230, 160, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Central Emblem: Modern Stylized Medical Cross + Wellness Heart Leaf
    ctx.save();
    ctx.translate(256, 220);

    // Drop shadow for the icon glyph
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 12;

    // Cross horizontal bar
    const barWidth = 190;
    const barHeight = 58;
    const radius = 22;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight, radius);
    ctx.fill();

    // Cross vertical bar
    const vBarWidth = 58;
    const vBarHeight = 190;
    ctx.beginPath();
    ctx.roundRect(-vBarWidth / 2, -vBarHeight / 2, vBarWidth, vBarHeight, radius);
    ctx.fill();

    // Center circular pulse with subtle golden warm heart
    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    const centerGrad = ctx.createLinearGradient(-30, -30, 30, 30);
    centerGrad.addColorStop(0, '#006A60');
    centerGrad.addColorStop(1, '#004D40');
    ctx.fillStyle = centerGrad;
    ctx.fill();

    // Inner heart-leaf motif in gold
    ctx.beginPath();
    ctx.arc(-8, -4, 9, 0, Math.PI * 2);
    ctx.arc(8, -4, 9, 0, Math.PI * 2);
    ctx.moveTo(-16, -2);
    ctx.lineTo(0, 16);
    ctx.lineTo(16, -2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();

    ctx.restore();

    // Brand text at bottom: "WELLENI"
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 38px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillText('WELLENI', 256, 430);

    // Subtitle text: "SRI SANKALPA"
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '600 18px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('SRI SANKALPA HOSPITAL', 256, 465);

    setIconUrl(canvas.toDataURL('image/png'));
  };

  // 2. Draw Feature Graphic (1024 x 500 px)
  const drawFeature = () => {
    const canvas = featureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1024;
    canvas.height = 500;

    // Background Gradient: Deep surgical teal to charcoal teal
    const bg = ctx.createLinearGradient(0, 0, 1024, 500);
    bg.addColorStop(0, '#00332C');
    bg.addColorStop(0.4, '#004D40');
    bg.addColorStop(1, '#00241E');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1024, 500);

    // Decorative ambient circles
    const rad1 = ctx.createRadialGradient(200, 150, 10, 200, 150, 350);
    rad1.addColorStop(0, 'rgba(45, 212, 191, 0.22)');
    rad1.addColorStop(1, 'transparent');
    ctx.fillStyle = rad1;
    ctx.fillRect(0, 0, 1024, 500);

    const rad2 = ctx.createRadialGradient(850, 350, 10, 850, 350, 300);
    rad2.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
    rad2.addColorStop(1, 'transparent');
    ctx.fillStyle = rad2;
    ctx.fillRect(0, 0, 1024, 500);

    // Left Section: Badges & Brand
    // App pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(60, 48, 220, 36, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#2DD4BF';
    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('⚡ 24/7 EMERGENCY & CASUALTY', 76, 71);

    // Hospital Name Heading
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px system-ui, -apple-system, sans-serif';
    ctx.fillText('Sri Sankalpa Hospital', 60, 140);

    // Tagline
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '500 21px system-ui, -apple-system, sans-serif';
    ctx.fillText('Multi-Speciality Care, Advanced Laparoscopy & Maternity', 60, 178);

    // Location
    ctx.fillStyle = '#99F6E4';
    ctx.font = '500 16px system-ui, -apple-system, sans-serif';
    ctx.fillText('📍 Huzurnagar Road, Kodad, Telangana 508206', 60, 212);

    // Doctor Cards on Right Side
    // Doctor Card 1: Dr. Adapa Sandhya
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(580, 50, 384, 150, 20);
    ctx.fill();
    ctx.stroke();

    // Doctor 1 Avatar circle
    ctx.fillStyle = '#0D9488';
    ctx.beginPath();
    ctx.arc(636, 115, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AS', 636, 122);

    // Doctor 1 Details
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.fillText('Dr. Adapa Sandhya', 690, 95);

    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('MS (OBG) • Obstetrician & Gynecologist', 690, 120);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '500 13px system-ui, -apple-system, sans-serif';
    ctx.fillText('Reg: TSMC 88726 • High-Risk Maternity & PCOD', 690, 145);

    ctx.fillStyle = '#99F6E4';
    ctx.font = '600 12px system-ui, -apple-system, sans-serif';
    ctx.fillText('⭐ 4.9 Rating • 10+ Yrs Exp', 690, 168);

    // Doctor Card 2: Dr. Vishwa Kiran Sai
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(580, 220, 384, 150, 20);
    ctx.fill();
    ctx.stroke();

    // Doctor 2 Avatar circle
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.arc(636, 285, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VK', 636, 292);

    // Doctor 2 Details
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.fillText('Dr. Vishwa Kiran Sai', 690, 265);

    ctx.fillStyle = '#67E8F9';
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('MS, FMAS, FIAGES • Laparoscopic Surgeon', 690, 290);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '500 13px system-ui, -apple-system, sans-serif';
    ctx.fillText('Reg: TSMC 96924 • Gallbladder, Hernia, Piles', 690, 315);

    ctx.fillStyle = '#99F6E4';
    ctx.font = '600 12px system-ui, -apple-system, sans-serif';
    ctx.fillText('⭐ 4.9 Rating • 12+ Yrs Exp', 690, 338);

    // Bottom Badges Strip
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 410, 1024, 90);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(0, 410, 1024, 1);

    const badges = [
      '🐍 Snakebite & Poisoning Unit',
      '🔬 Keyhole Laparoscopic OT',
      '👶 Painless Delivery',
      '💊 24/7 Pharmacy & Lab',
      '📞 7095330066',
    ];

    let currentX = 60;
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    badges.forEach((b) => {
      const w = ctx.measureText(b).width + 30;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.roundRect(currentX, 432, w, 42, 12);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.fillText(b, currentX + 15, 458);
      currentX += w + 16;
    });

    setFeatureUrl(canvas.toDataURL('image/png'));
  };

  // Helper to draw phone screenshot base template (1080 x 1920)
  const drawPhoneScreenshot = (
    canvas: HTMLCanvasElement,
    headerTag: string,
    mainTitle: string,
    subTitle: string,
    drawScreenContent: (ctx: CanvasRenderingContext2D) => void,
    setUrl: (url: string) => void
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1920;

    // Background Gradient: Android play store showcase background
    const bg = ctx.createLinearGradient(0, 0, 1080, 1920);
    bg.addColorStop(0, '#004D40');
    bg.addColorStop(0.35, '#002E27');
    bg.addColorStop(1, '#001A16');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1920);

    // Decorative radial aura
    const aura = ctx.createRadialGradient(540, 400, 10, 540, 400, 600);
    aura.addColorStop(0, 'rgba(45, 212, 191, 0.25)');
    aura.addColorStop(1, 'transparent');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, 1080, 1920);

    // Top Marketing Category Pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(140, 70, 800, 54, 27);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#2DD4BF';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(headerTag, 540, 105);

    // Primary Marketing Headline
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 54px system-ui, -apple-system, sans-serif';
    ctx.fillText(mainTitle, 540, 185);

    // Subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '500 28px system-ui, -apple-system, sans-serif';
    ctx.fillText(subTitle, 540, 235);

    // Render Simulated Android Phone Frame
    ctx.save();
    ctx.translate(90, 300);

    // Outer Phone Body Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 30;

    // Phone Frame Shell
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.roundRect(0, 0, 900, 1580, 48);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';

    // Screen Bezel
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.roundRect(16, 16, 868, 1548, 38);
    ctx.fill();
    ctx.clip(); // Clip all drawing to inside screen!

    // Top Status Bar
    ctx.fillStyle = '#004D40';
    ctx.fillRect(16, 16, 868, 80);

    // Camera punch hole
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(450, 44, 12, 0, Math.PI * 2);
    ctx.fill();

    // Status bar clock & icons
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('9:41', 50, 52);
    ctx.textAlign = 'right';
    ctx.fillText('5G  100%', 850, 52);

    // Welleni App Bar
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(16, 96, 868, 90);
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(16, 184, 868, 2);

    // Brand on App Bar
    ctx.fillStyle = '#006A60';
    ctx.beginPath();
    ctx.arc(65, 140, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('W', 65, 148);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Welleni Healthcare', 105, 148);

    // Screen Content Callback
    drawScreenContent(ctx);

    // Bottom Navigation Bar in Phone
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(16, 1460, 868, 104);
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(16, 1460, 868, 2);

    const navs = ['Home', 'Hospitals', 'Bookings', 'Profile'];
    const navIcons = ['🏠', '🏥', '📅', '👤'];
    navs.forEach((nav, idx) => {
      const nx = 120 + idx * 215;
      ctx.textAlign = 'center';
      ctx.font = '28px system-ui';
      ctx.fillText(navIcons[idx], nx, 1505);
      ctx.fillStyle = idx === 0 ? '#006A60' : '#64748B';
      ctx.font = `${idx === 0 ? 'bold' : 'normal'} 16px system-ui`;
      ctx.fillText(nav, nx, 1535);
    });

    ctx.restore();
    setUrl(canvas.toDataURL('image/png'));
  };

  // 3. Screenshot 1: Home & 24/7 Hospital Care
  const drawScreenshot1 = () => {
    const canvas = ss1CanvasRef.current;
    if (!canvas) return;

    drawPhoneScreenshot(
      canvas,
      '🏥 SRI SANKALPA HOSPITALS • KODAD',
      '24/7 Emergency & Multi-Speciality',
      'Comprehensive healthcare, casualty care & instant doctor appointments',
      (ctx) => {
        // Hospital Hero Banner Card
        ctx.fillStyle = '#004D40';
        ctx.beginPath();
        ctx.roundRect(40, 220, 820, 310, 24);
        ctx.fill();

        // 24/7 Emergency Badge
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.roundRect(65, 245, 190, 42, 21);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('🚨 24/7 EMERGENCY', 160, 272);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 36px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText('Sri Sankalpa Hospitals', 65, 335);

        ctx.fillStyle = '#99F6E4';
        ctx.font = '500 20px system-ui';
        ctx.fillText('Huzurnagar Road, Kodad, Telangana 508206', 65, 375);

        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = '400 17px system-ui';
        ctx.fillText('Landmark: Beside TTD Kalyana Mandapam, Opp. Pasuvula Santha', 65, 410);

        // Call button on card
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(65, 445, 260, 56, 16);
        ctx.fill();
        ctx.fillStyle = '#004D40';
        ctx.font = 'bold 20px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('📞 7095330066', 195, 480);

        // Emergency Poisoning & Casualty Feature Card
        ctx.fillStyle = '#FEF2F2';
        ctx.strokeStyle = '#FCA5A5';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(40, 560, 820, 190, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#991B1B';
        ctx.font = 'bold 24px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText('🚑 Snakebite, Scorpion & Poisoning Unit', 70, 610);

        ctx.fillStyle = '#7F1D1D';
        ctx.font = '400 18px system-ui';
        ctx.fillText('Anti-venom care for snake & scorpion bites, acute pesticide management,', 70, 650);
        ctx.fillText('trauma & emergency seizure stabilization with round-the-clock doctors.', 70, 680);

        // Hospital Facilities Grid
        const facilities = [
          { title: '🔬 Keyhole Laparoscopic OT', desc: 'Gallbladder, hernia, appendix & piles' },
          { title: '👶 Maternity & Deliveries', desc: 'Normal & high-risk deliveries with ICU' },
          { title: '🩺 General Medicine & ICU', desc: 'Diabetes, BP, dengue, fever & kidney care' },
          { title: '💊 24/7 Pharmacy & Lab', desc: 'Emergency medicines & fast lab tests' },
        ];

        facilities.forEach((fac, idx) => {
          const fx = 40 + (idx % 2) * 420;
          const fy = 780 + Math.floor(idx / 2) * 260;

          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(fx, fy, 400, 230, 20);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 20px system-ui';
          ctx.textAlign = 'left';
          ctx.fillText(fac.title, fx + 25, fy + 55);

          ctx.fillStyle = '#64748B';
          ctx.font = '400 16px system-ui';
          ctx.fillText(fac.desc, fx + 25, fy + 95);

          ctx.fillStyle = '#006A60';
          ctx.font = 'bold 16px system-ui';
          ctx.fillText('Available 24/7 →', fx + 25, fy + 190);
        });

        // Quick Booking Callout Button
        ctx.fillStyle = '#006A60';
        ctx.beginPath();
        ctx.roundRect(40, 1340, 820, 80, 20);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Book Specialist Consultation Today →', 450, 1390);
      },
      setSs1Url
    );
  };

  // 4. Screenshot 2: Top Specialist Doctors
  const drawScreenshot2 = () => {
    const canvas = ss2CanvasRef.current;
    if (!canvas) return;

    drawPhoneScreenshot(
      canvas,
      '👨‍⚕️ EXPERT SPECIALISTS • SRI SANKALPA',
      'Consult Top Specialist Doctors',
      'Gynecology, Obstetrics, Laparoscopy & General Surgery Specialists',
      (ctx) => {
        // Section Header
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 30px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText('Resident Specialists & Surgeons', 45, 235);

        ctx.fillStyle = '#64748B';
        ctx.font = '400 18px system-ui';
        ctx.fillText('Verified TSMC registration • Daily morning & evening OPD', 45, 268);

        // Doctor Card 1: Dr. Adapa Sandhya
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(40, 305, 820, 480, 24);
        ctx.fill();
        ctx.stroke();

        // Doctor 1 Avatar
        ctx.fillStyle = '#CCFBF1';
        ctx.beginPath();
        ctx.arc(110, 385, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0F766E';
        ctx.font = 'bold 30px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('AS', 110, 395);

        // Names & qualifications
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 28px system-ui';
        ctx.fillText('Dr. Adapa Sandhya', 180, 365);

        ctx.fillStyle = '#D97706';
        ctx.font = 'bold 18px system-ui';
        ctx.fillText('MS (OBG) • Obstetrician & Gynecologist', 180, 400);

        ctx.fillStyle = '#64748B';
        ctx.font = '500 16px system-ui';
        ctx.fillText('TSMC Reg: 88726 • 10+ Years Experience • ⭐ 4.9 (124 reviews)', 180, 430);

        // Expertise chips
        const chips1 = ['Painless Delivery', 'PCOD / PCOS', 'Infertility Care', 'High-Risk Pregnancy'];
        let cx = 65;
        chips1.forEach((chip) => {
          ctx.fillStyle = '#F0FDFA';
          ctx.strokeStyle = '#99F6E4';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(cx, 465, 175, 40, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#0F766E';
          ctx.font = 'bold 14px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText(chip, cx + 87, 490);
          cx += 185;
        });

        // Time slots
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 17px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText('Available Slots Today:', 65, 545);

        const slots = ['10:00 AM', '11:30 AM', '05:30 PM', '07:00 PM'];
        slots.forEach((slot, sIdx) => {
          const sx = 65 + sIdx * 185;
          ctx.fillStyle = sIdx === 1 ? '#006A60' : '#F1F5F9';
          ctx.beginPath();
          ctx.roundRect(sx, 565, 175, 46, 12);
          ctx.fill();

          ctx.fillStyle = sIdx === 1 ? '#FFFFFF' : '#334155';
          ctx.font = 'bold 16px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText(slot, sx + 87, 594);
        });

        // Fee & Book button
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 22px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText('Fee: ₹300', 65, 745);

        ctx.fillStyle = '#006A60';
        ctx.beginPath();
        ctx.roundRect(560, 705, 270, 60, 16);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Book Appointment →', 695, 742);

        // Doctor Card 2: Dr. Vishwa Kiran Sai
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(40, 815, 820, 480, 24);
        ctx.fill();
        ctx.stroke();

        // Doctor 2 Avatar
        ctx.fillStyle = '#E0F2FE';
        ctx.beginPath();
        ctx.arc(110, 895, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0369A1';
        ctx.font = 'bold 30px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('VK', 110, 905);

        // Names & qualifications
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 28px system-ui';
        ctx.fillText('Dr. Vishwa Kiran Sai', 180, 875);

        ctx.fillStyle = '#0284C7';
        ctx.font = 'bold 18px system-ui';
        ctx.fillText('MS, FMAS, FIAGES • Laparoscopic & General Surgeon', 180, 910);

        ctx.fillStyle = '#64748B';
        ctx.font = '500 16px system-ui';
        ctx.fillText('TSMC Reg: 96924 • 12+ Years Experience • ⭐ 4.9 (158 reviews)', 180, 940);

        // Expertise chips
        const chips2 = ['Gallbladder Stones', 'Hernia Surgery', 'Appendix Surgery', 'Piles & Fissures'];
        let cx2 = 65;
        chips2.forEach((chip) => {
          ctx.fillStyle = '#F0F9FF';
          ctx.strokeStyle = '#BAE6FD';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(cx2, 975, 175, 40, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#0369A1';
          ctx.font = 'bold 14px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText(chip, cx2 + 87, 1000);
          cx2 += 185;
        });

        // Time slots
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 17px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText('Available Slots Today:', 65, 1055);

        slots.forEach((slot, sIdx) => {
          const sx = 65 + sIdx * 185;
          ctx.fillStyle = sIdx === 0 ? '#006A60' : '#F1F5F9';
          ctx.beginPath();
          ctx.roundRect(sx, 1075, 175, 46, 12);
          ctx.fill();

          ctx.fillStyle = sIdx === 0 ? '#FFFFFF' : '#334155';
          ctx.font = 'bold 16px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText(slot, sx + 87, 1104);
        });

        // Fee & Book button
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 22px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText('Fee: ₹300', 65, 1255);

        ctx.fillStyle = '#006A60';
        ctx.beginPath();
        ctx.roundRect(560, 1215, 270, 60, 16);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Book Appointment →', 695, 1252);
      },
      setSs2Url
    );
  };

  // 5. Screenshot 3: Instant Booking & Token
  const drawScreenshot3 = () => {
    const canvas = ss3CanvasRef.current;
    if (!canvas) return;

    drawPhoneScreenshot(
      canvas,
      '🎫 ZERO WAIT TIME • DIGITAL TOKENS',
      'Instant Confirmation & Reminders',
      'Download appointments to Google Calendar & get notified on phone',
      (ctx) => {
        // Confirmed Booking Card
        ctx.fillStyle = '#004D40';
        ctx.beginPath();
        ctx.roundRect(40, 230, 820, 520, 28);
        ctx.fill();

        // Checkmark badge
        ctx.fillStyle = '#2DD4BF';
        ctx.beginPath();
        ctx.arc(110, 310, 36, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#004D40';
        ctx.font = 'bold 36px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('✓', 110, 322);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 32px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText('Appointment Confirmed!', 170, 305);

        ctx.fillStyle = '#99F6E4';
        ctx.font = 'bold 18px system-ui';
        ctx.fillText('Token #04 • Booking ID: WLL-2026-7842', 170, 335);

        // Divider
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(70, 380, 760, 1.5);

        // Consultation Details
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '16px system-ui';
        ctx.fillText('Consultant Doctor', 70, 420);
        ctx.fillText('Hospital & Location', 470, 420);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 22px system-ui';
        ctx.fillText('Dr. Vishwa Kiran Sai', 70, 455);
        ctx.fillText('Sri Sankalpa Hospital', 470, 455);

        ctx.fillStyle = '#FCD34D';
        ctx.font = 'bold 16px system-ui';
        ctx.fillText('General & Laparoscopic Surgery', 70, 485);
        ctx.fillStyle = '#99F6E4';
        ctx.fillText('Huzurnagar Road, Kodad', 470, 485);

        // Time slot badge
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        ctx.roundRect(70, 530, 760, 90, 18);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText('📅 Today, 11:30 AM  (Morning Session)', 105, 582);

        // Action Buttons inside confirmation
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(70, 650, 360, 64, 16);
        ctx.fill();
        ctx.fillStyle = '#004D40';
        ctx.font = 'bold 18px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('📥 Add to Calendar (.ics)', 250, 690);

        ctx.fillStyle = '#0D9488';
        ctx.beginPath();
        ctx.roundRect(470, 650, 360, 64, 16);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px system-ui';
        ctx.fillText('🗺️ Get Directions', 650, 690);

        // Feature Highlight 2: Prescription & Medical Records
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(40, 790, 820, 360, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 26px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText('📋 Digital Health Records & Prescriptions', 75, 845);

        ctx.fillStyle = '#64748B';
        ctx.font = '400 18px system-ui';
        ctx.fillText('Access your past doctor prescriptions, lab test reports and bills anytime.', 75, 885);

        const recItems = [
          { title: 'Dr. Adapa Sandhya - Consultation Record', date: '04 Sep 2026', type: 'Prescription PDF' },
          { title: 'Sri Sankalpa Diagnostic Lab - CBC Blood Test', date: '04 Sep 2026', type: 'Lab Report' },
          { title: 'Pharmacy Bill & Medicine Intake Schedule', date: '04 Sep 2026', type: 'Medication' },
        ];

        recItems.forEach((r, idx) => {
          const ry = 925 + idx * 68;
          ctx.fillStyle = '#F8FAFC';
          ctx.beginPath();
          ctx.roundRect(75, ry, 750, 56, 12);
          ctx.fill();

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 17px system-ui';
          ctx.fillText(r.title, 100, ry + 34);

          ctx.fillStyle = '#0F766E';
          ctx.font = 'bold 14px system-ui';
          ctx.textAlign = 'right';
          ctx.fillText(r.type, 800, ry + 34);
          ctx.textAlign = 'left';
        });

        // Emergency Call Support Box
        ctx.fillStyle = '#FEF2F2';
        ctx.strokeStyle = '#FCA5A5';
        ctx.beginPath();
        ctx.roundRect(40, 1180, 820, 180, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#991B1B';
        ctx.font = 'bold 24px system-ui';
        ctx.fillText('🚨 Need Immediate Emergency Ambulance?', 75, 1235);

        ctx.fillStyle = '#7F1D1D';
        ctx.font = '400 18px system-ui';
        ctx.fillText('24/7 dedicated hospital casualty helpline for Kodad & surrounding mandals.', 75, 1275);

        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.roundRect(75, 1300, 340, 46, 12);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Call 7095330066 Now', 245, 1330);
      },
      setSs3Url
    );
  };

  // 6. Screenshot 4: Advanced Facilities & Maternity OT
  const drawScreenshot4 = () => {
    const canvas = ss4CanvasRef.current;
    if (!canvas) return;

    drawPhoneScreenshot(
      canvas,
      '🏥 WORLD-CLASS INFRASTRUCTURE',
      'Advanced OT, ICU & 24/7 Diagnostics',
      'Modern surgical suites, high-risk maternity care & round-the-clock pharmacy',
      (ctx) => {
        // Showcase Cards
        const units = [
          {
            icon: '🔬',
            title: 'Laparoscopic Keyhole Surgery OT',
            desc: 'High-definition endoscopic towers for scarless gallbladder, hernia & appendix surgeries with faster discharge.',
            tag: 'Advanced OT',
          },
          {
            icon: '👶',
            title: 'Obstetrics & Maternity Wing',
            desc: 'Comfortable labor recovery rooms, fetal monitoring, painless delivery and newborn intensive care support.',
            tag: 'Maternity',
          },
          {
            icon: '🐍',
            title: '24/7 Casualty & Poison Center',
            desc: 'Govt-grade anti-snake venom, scorpion bite management, organophosphorus poisoning resuscitation.',
            tag: '24/7 Casualty',
          },
          {
            icon: '💊',
            title: '24/7 In-House Pharmacy & Lab',
            desc: 'Fully stocked round-the-clock pharmacy, biochemistry, hematology, ECG, and emergency diagnostics.',
            tag: 'Always Open',
          },
        ];

        units.forEach((u, idx) => {
          const uy = 230 + idx * 280;

          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(40, uy, 820, 250, 24);
          ctx.fill();
          ctx.stroke();

          // Icon box
          ctx.fillStyle = '#F0FDFA';
          ctx.beginPath();
          ctx.roundRect(70, uy + 30, 70, 70, 16);
          ctx.fill();

          ctx.font = '36px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText(u.icon, 105, uy + 78);

          // Tag
          ctx.fillStyle = '#0F766E';
          ctx.font = 'bold 14px system-ui';
          ctx.textAlign = 'right';
          ctx.fillText(u.tag, 820, uy + 55);

          // Title
          ctx.textAlign = 'left';
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 24px system-ui';
          ctx.fillText(u.title, 160, uy + 70);

          // Description
          ctx.fillStyle = '#475569';
          ctx.font = '400 18px system-ui';
          ctx.fillText(u.desc.substring(0, 50), 70, uy + 140);
          ctx.fillText(u.desc.substring(50), 70, uy + 170);

          // Divider and footer
          ctx.fillStyle = '#F1F5F9';
          ctx.fillRect(70, uy + 195, 760, 2);

          ctx.fillStyle = '#006A60';
          ctx.font = 'bold 16px system-ui';
          ctx.fillText('Sri Sankalpa Hospital, Huzurnagar Road, Kodad', 70, uy + 228);
        });
      },
      setSs4Url
    );
  };

  // Render all assets on mount
  useEffect(() => {
    // Timeout gives canvas DOM elements time to bind
    const timer = setTimeout(() => {
      drawIcon();
      drawFeature();
      drawScreenshot1();
      drawScreenshot2();
      drawScreenshot3();
      drawScreenshot4();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Download Trigger
  const handleDownload = (canvas: HTMLCanvasElement | null, filename: string, id: string) => {
    if (!canvas) return;
    setDownloadingId(id);

    canvas.toBlob((blob) => {
      if (!blob) {
        setDownloadingId(null);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setTimeout(() => {
        setDownloadingId(null);
      }, 800);
    }, 'image/png');
  };

  const handleDownloadAll = () => {
    setDownloadingId('all');
    const items = [
      { canvas: iconCanvasRef.current, name: '1_playstore_app_icon_512x512.png' },
      { canvas: featureCanvasRef.current, name: '2_playstore_feature_graphic_1024x500.png' },
      { canvas: ss1CanvasRef.current, name: '3_screenshot_home_casualty_1080x1920.png' },
      { canvas: ss2CanvasRef.current, name: '4_screenshot_specialist_doctors_1080x1920.png' },
      { canvas: ss3CanvasRef.current, name: '5_screenshot_appointments_records_1080x1920.png' },
      { canvas: ss4CanvasRef.current, name: '6_screenshot_advanced_ot_maternity_1080x1920.png' },
    ];

    items.forEach((item, index) => {
      if (item.canvas) {
        setTimeout(() => {
          item.canvas?.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = item.name;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          }, 'image/png');
        }, index * 400);
      }
    });

    setTimeout(() => {
      setDownloadingId(null);
    }, items.length * 400 + 500);
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const storeListingMetadata = {
    title: 'Welleni: Sri Sankalpa Hospital',
    shortDescription: 'Book doctor appointments & 24/7 emergency care at Sri Sankalpa Hospital Kodad.',
    fullDescription: `Welcome to Welleni – the official healthcare platform for Sri Sankalpa Hospitals, Kodad's premier multi-speciality medical center.

🏥 ABOUT SRI SANKALPA HOSPITALS:
Located prominently on Huzurnagar Road (beside TTD Kalyana Mandapam, opp. Pasuvula Santha, Kodad, Telangana 508206), Sri Sankalpa Hospitals offers compassionate, world-class clinical care with 24/7 emergency casualty, advanced surgical OT, and modern maternity facilities.

👨‍⚕️ EXPERT RESIDENT SPECIALISTS:
1. Dr. Adapa Sandhya – MS (OBG)
   • Specialist Obstetrician & Gynecologist (TSMC Reg: 88726)
   • Comprehensive High-Risk Pregnancy Care, Painless Normal Deliveries, PCOD/PCOS Management, Infertility Evaluation, and Women's Wellness.

2. Dr. Vishwa Kiran Sai – MS, FMAS, FIAGES
   • Consultant General & Laparoscopic Surgeon (TSMC Reg: 96924)
   • Advanced Minimally Invasive Keyhole Surgery for Gallbladder Stones, Appendix, Hernia, Piles, Fissures, Fistulas, and Trauma Care.

🚨 24/7 EMERGENCY & CRITICAL CARE:
• Dedicated Casualty & Poisoning Unit: Specialized management for Snakebite (Anti-Snake Venom available round-the-clock), Scorpion Stings, Acute Pesticide Poisoning, Seizure stabilization, and Trauma resuscitation.
• 24/7 In-House Pharmacy: Instant access to critical life-saving medications.
• Round-the-Clock Diagnostic Lab: Fast blood analysis, biochemistry, and pathology reporting.
• Emergency Helplines: 7095330066 / 7095440066.

📱 KEY APP FEATURES:
• Instant Doctor Appointments: Browse doctor availability, select preferred morning/evening OPD slots, and receive immediate digital tokens.
• Calendar Sync: Export your confirmed bookings directly to your device calendar (.ics).
• Direct Calling: One-tap connection to hospital reception and emergency ambulance.
• Hospital Navigation: Direct Google Maps directions to the hospital campus in Kodad.
• Multilingual Support: Full support for both English and Telugu (తెలుగు).

Download Welleni today for reliable, accessible, and high-quality healthcare at Sri Sankalpa Hospitals, Kodad!`,
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hidden processing canvases */}
      <canvas ref={iconCanvasRef} className="hidden" />
      <canvas ref={featureCanvasRef} className="hidden" />
      <canvas ref={ss1CanvasRef} className="hidden" />
      <canvas ref={ss2CanvasRef} className="hidden" />
      <canvas ref={ss3CanvasRef} className="hidden" />
      <canvas ref={ss4CanvasRef} className="hidden" />

      {/* Top Bar Header */}
      <div className="bg-surface-container-lowest rounded-3xl p-5 md:p-7 border border-surface-variant shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-surface-variant text-on-surface transition-colors"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface font-sans">
              Google Play Store Asset Studio
            </h1>
          </div>
          <p className="text-xs md:text-sm text-on-surface-variant pl-11">
            Official graphics & store listing assets for <strong>Welleni (Sri Sankalpa Hospitals, Kodad)</strong>. Ready to upload directly to Google Play Console.
          </p>
        </div>

        {/* Global Action */}
        <button
          onClick={handleDownloadAll}
          disabled={downloadingId !== null}
          className="w-full md:w-auto px-6 py-3.5 bg-primary hover:bg-teal-deep text-on-primary rounded-2xl font-bold text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">
            {downloadingId === 'all' ? 'hourglass_top' : 'download_for_offline'}
          </span>
          <span>{downloadingId === 'all' ? 'Generating Assets...' : 'Download All 6 Assets (PNG)'}</span>
        </button>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-variant pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('visual')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'visual'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-base">palette</span>
          <span>Common Visual Assets (Icon & Feature Graphic)</span>
        </button>

        <button
          onClick={() => setActiveTab('screenshots')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'screenshots'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-base">smartphone</span>
          <span>Phone Screenshots (1080 x 1920)</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-primary text-xs font-extrabold">4</span>
        </button>

        <button
          onClick={() => setActiveTab('metadata')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'metadata'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-base">description</span>
          <span>Store Listing Copy & Text</span>
        </button>
      </div>

      {/* TAB 1: Common Visual Assets */}
      {activeTab === 'visual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* App Icon Card */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-3xl p-6 border border-surface-variant shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-on-surface">App Icon</h3>
                <p className="text-xs text-on-surface-variant">512 x 512 px • 32-bit PNG • Max 1 MB</p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-mist/40 text-primary">
                Required
              </span>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-2xl border border-surface-variant/70">
              {iconUrl ? (
                <div className="relative group">
                  <img
                    src={iconUrl}
                    alt="Play Store App Icon 512x512"
                    className="w-48 h-48 rounded-3xl shadow-xl border border-white/20 transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                    512 × 512 PNG
                  </div>
                </div>
              ) : (
                <div className="w-48 h-48 rounded-3xl bg-surface-container animate-pulse flex items-center justify-center text-outline text-xs">
                  Generating Icon...
                </div>
              )}
              <p className="text-xs text-center text-outline mt-3">
                Target: Google Play Console → Common visual assets → App icon
              </p>
            </div>

            <button
              onClick={() => handleDownload(iconCanvasRef.current, 'playstore_app_icon_512x512.png', 'icon')}
              disabled={downloadingId !== null}
              className="w-full py-3 bg-primary hover:bg-teal-deep text-on-primary rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-2xs"
            >
              <span className="material-symbols-outlined text-base">
                {downloadingId === 'icon' ? 'hourglass_top' : 'download'}
              </span>
              <span>{downloadingId === 'icon' ? 'Exporting...' : 'Download 512x512 Icon (PNG)'}</span>
            </button>
          </div>

          {/* Feature Graphic Card */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-3xl p-6 border border-surface-variant shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-on-surface">Feature Graphic</h3>
                <p className="text-xs text-on-surface-variant">1024 x 500 px • 24-bit PNG/JPG • Max 15 MB</p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-mist/40 text-primary">
                Required
              </span>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center p-4 bg-surface-container-low rounded-2xl border border-surface-variant/70">
              {featureUrl ? (
                <div className="relative group w-full overflow-hidden rounded-2xl">
                  <img
                    src={featureUrl}
                    alt="Play Store Feature Graphic 1024x500"
                    className="w-full h-auto aspect-[1024/500] object-cover rounded-xl shadow-lg border border-white/20 transition-transform group-hover:scale-101"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                    1024 × 500 PNG
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[1024/500] rounded-xl bg-surface-container animate-pulse flex items-center justify-center text-outline text-xs">
                  Generating Feature Graphic...
                </div>
              )}
              <p className="text-xs text-center text-outline mt-3">
                Target: Google Play Console → Common visual assets → Feature graphic
              </p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-on-surface-variant">
                Features Sri Sankalpa Hospitals, Dr. Adapa Sandhya, Dr. Vishwa Kiran Sai, 24/7 Casualty & Kodad address.
              </span>
              <button
                onClick={() => handleDownload(featureCanvasRef.current, 'playstore_feature_graphic_1024x500.png', 'feature')}
                disabled={downloadingId !== null}
                className="px-6 py-3 bg-primary hover:bg-teal-deep text-on-primary rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-2xs shrink-0"
              >
                <span className="material-symbols-outlined text-base">
                  {downloadingId === 'feature' ? 'hourglass_top' : 'download'}
                </span>
                <span>{downloadingId === 'feature' ? 'Exporting...' : 'Download 1024x500 Graphic (PNG)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Phone Screenshots */}
      {activeTab === 'screenshots' && (
        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-on-surface">Phone Assets (Screenshots)</h3>
              <p className="text-xs text-on-surface-variant">
                Google Play requires <strong>at least 2 screenshots</strong> (16:9 or 9:16 aspect ratio). We have generated <strong>4 pixel-perfect 1080 x 1920 phone mockups</strong>.
              </p>
            </div>
            <button
              onClick={handleDownloadAll}
              className="px-4 py-2 bg-sand-soft text-primary border border-surface-variant rounded-xl font-bold text-xs flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Download All Screenshots</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Screenshot 1 */}
            <div className="bg-surface-container-lowest rounded-3xl p-4 border border-surface-variant shadow-sm space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  Screenshot #1
                </span>
                <span className="text-[10px] text-outline font-semibold">1080 × 1920</span>
              </div>
              <h4 className="font-bold text-xs text-on-surface line-clamp-1">
                24/7 Emergency Casualty & Hospital
              </h4>

              <div className="flex-1 bg-surface-container-low rounded-2xl p-2 flex items-center justify-center">
                {ss1Url ? (
                  <img
                    src={ss1Url}
                    alt="Screenshot 1"
                    className="w-full max-h-[380px] object-contain rounded-xl shadow-md"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-outline text-xs">Loading...</div>
                )}
              </div>

              <button
                onClick={() => handleDownload(ss1CanvasRef.current, '1_screenshot_home_casualty_1080x1920.png', 'ss1')}
                disabled={downloadingId !== null}
                className="w-full py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download Screenshot #1</span>
              </button>
            </div>

            {/* Screenshot 2 */}
            <div className="bg-surface-container-lowest rounded-3xl p-4 border border-surface-variant shadow-sm space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  Screenshot #2
                </span>
                <span className="text-[10px] text-outline font-semibold">1080 × 1920</span>
              </div>
              <h4 className="font-bold text-xs text-on-surface line-clamp-1">
                Top Specialists & Surgeon Booking
              </h4>

              <div className="flex-1 bg-surface-container-low rounded-2xl p-2 flex items-center justify-center">
                {ss2Url ? (
                  <img
                    src={ss2Url}
                    alt="Screenshot 2"
                    className="w-full max-h-[380px] object-contain rounded-xl shadow-md"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-outline text-xs">Loading...</div>
                )}
              </div>

              <button
                onClick={() => handleDownload(ss2CanvasRef.current, '2_screenshot_specialist_doctors_1080x1920.png', 'ss2')}
                disabled={downloadingId !== null}
                className="w-full py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download Screenshot #2</span>
              </button>
            </div>

            {/* Screenshot 3 */}
            <div className="bg-surface-container-lowest rounded-3xl p-4 border border-surface-variant shadow-sm space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  Screenshot #3
                </span>
                <span className="text-[10px] text-outline font-semibold">1080 × 1920</span>
              </div>
              <h4 className="font-bold text-xs text-on-surface line-clamp-1">
                Digital Tokens & Calendar Sync
              </h4>

              <div className="flex-1 bg-surface-container-low rounded-2xl p-2 flex items-center justify-center">
                {ss3Url ? (
                  <img
                    src={ss3Url}
                    alt="Screenshot 3"
                    className="w-full max-h-[380px] object-contain rounded-xl shadow-md"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-outline text-xs">Loading...</div>
                )}
              </div>

              <button
                onClick={() => handleDownload(ss3CanvasRef.current, '3_screenshot_appointments_records_1080x1920.png', 'ss3')}
                disabled={downloadingId !== null}
                className="w-full py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download Screenshot #3</span>
              </button>
            </div>

            {/* Screenshot 4 */}
            <div className="bg-surface-container-lowest rounded-3xl p-4 border border-surface-variant shadow-sm space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  Screenshot #4
                </span>
                <span className="text-[10px] text-outline font-semibold">1080 × 1920</span>
              </div>
              <h4 className="font-bold text-xs text-on-surface line-clamp-1">
                Advanced OT, Maternity & ICU
              </h4>

              <div className="flex-1 bg-surface-container-low rounded-2xl p-2 flex items-center justify-center">
                {ss4Url ? (
                  <img
                    src={ss4Url}
                    alt="Screenshot 4"
                    className="w-full max-h-[380px] object-contain rounded-xl shadow-md"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-outline text-xs">Loading...</div>
                )}
              </div>

              <button
                onClick={() => handleDownload(ss4CanvasRef.current, '4_screenshot_advanced_ot_maternity_1080x1920.png', 'ss4')}
                disabled={downloadingId !== null}
                className="w-full py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download Screenshot #4</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Store Listing Copy */}
      {activeTab === 'metadata' && (
        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-surface-variant shadow-sm space-y-6">
            <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">content_paste</span>
              <span>Play Store Listing Metadata (Copy & Paste directly)</span>
            </h3>

            {/* App Name Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  App Name (Max 30 characters)
                </label>
                <span className="text-xs text-outline">{storeListingMetadata.title.length} / 30 chars</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={storeListingMetadata.title}
                  className="flex-1 px-4 py-2.5 bg-surface-container-low border border-surface-variant rounded-xl text-sm font-semibold text-on-surface focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(storeListingMetadata.title, 'title')}
                  className="px-4 py-2.5 bg-primary hover:bg-teal-deep text-on-primary rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedField === 'title' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedField === 'title' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Short Description Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Short Description (Max 80 characters)
                </label>
                <span className="text-xs text-outline">{storeListingMetadata.shortDescription.length} / 80 chars</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={storeListingMetadata.shortDescription}
                  className="flex-1 px-4 py-2.5 bg-surface-container-low border border-surface-variant rounded-xl text-sm font-semibold text-on-surface focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(storeListingMetadata.shortDescription, 'short')}
                  className="px-4 py-2.5 bg-primary hover:bg-teal-deep text-on-primary rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedField === 'short' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedField === 'short' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Full Description Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Full Description (Max 4000 characters)
                </label>
                <span className="text-xs text-outline">{storeListingMetadata.fullDescription.length} / 4000 chars</span>
              </div>
              <textarea
                readOnly
                rows={12}
                value={storeListingMetadata.fullDescription}
                className="w-full p-4 bg-surface-container-low border border-surface-variant rounded-xl text-xs sm:text-sm font-mono text-on-surface focus:outline-none leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => copyToClipboard(storeListingMetadata.fullDescription, 'full')}
                  className="px-5 py-2.5 bg-primary hover:bg-teal-deep text-on-primary rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedField === 'full' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedField === 'full' ? 'Copied Full Description' : 'Copy Full Description'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
