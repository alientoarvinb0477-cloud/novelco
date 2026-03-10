'use client';

import React, { useState, useEffect } from 'react';
import { Editor, Frame, Element, useEditor, useNode } from '@craftjs/core';
import { supabase } from "@lib/supabase";
import { useParams } from "next/navigation";


// ─── TYPES ───────────────────────────────────────────────────────────────────
type Biz = { id: number; n: string; s: string; a: string; c: string };

// ─── GLOBAL WINDOW EXTENSION ─────────────────────────────────────────────────
declare global {
  interface Window { _editorActions: any; }
}

// ─── SVG SHAPE DIVIDER ────────────────────────────────────────────────────────
const ShapeDivider = ({ type, fill, position }: { type: string; fill: string; position: 'top' | 'bottom' }) => {
  const shapes: Record<string, React.ReactElement> = {
    slant:    <path d="M0,0 L1000,100 L1000,100 L0,100 Z" fill={fill} />,
    slantAlt: <path d="M0,100 L1000,0 L1000,100 L0,100 Z" fill={fill} />,
    curve:    <path d="M0,100 C250,0 750,200 1000,100 L1000,100 L0,100 Z" fill={fill} />,
    triangle: <path d="M500,0 L1000,100 L0,100 Z" fill={fill} />,
    wave:     <path d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100 L1000,100 L0,100 Z" fill={fill} />,
    stepped:  <path d="M0,100 L0,50 L333,50 L333,0 L666,0 L666,50 L1000,50 L1000,100 Z" fill={fill} />,
  };
  if (!shapes[type]) return null;
  return (
    <div style={{
      position: 'absolute',
      [position]: 0,
      left: 0,
      width: '100%',
      overflow: 'hidden',
      lineHeight: 0,
      transform: position === 'top' ? 'rotate(180deg)' : 'none',
      zIndex: 1,
      pointerEvents: 'none',
    }}>
      <svg viewBox="0 0 1000 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '80px' }}>
        {shapes[type]}
      </svg>
    </div>
  );
};

// ─── CRAFT COMPONENTS ─────────────────────────────────────────────────────────

const Text = ({ text, fontSize, color, textAlign, fontWeight, marginTop, marginBottom, letterSpacing, lineHeight }: any) => {
  const { connectors: { connect, drag }, selected, actions: { setProp } } = useNode((s) => ({ selected: s.events.selected }));
  const { enabled } = useEditor((s) => ({ enabled: s.options.enabled }));
  return (
    <div
      ref={(dom: any) => connect(drag(dom))}
      style={{
        fontSize: `${fontSize || 16}px`,
        color: color || '#000',
        textAlign: textAlign || 'center',
        fontWeight: fontWeight || 'normal',
        marginTop: `${marginTop || 0}px`,
        marginBottom: `${marginBottom || 0}px`,
        letterSpacing: `${letterSpacing || 0}px`,
        lineHeight: lineHeight || 1.4,
        zIndex: 2,
        position: 'relative',
        padding: '4px',
        outline: 'none',
        cursor: enabled ? 'text' : 'default',
        minWidth: '40px',
      }}
      className={enabled && selected ? 'ring-2 ring-[#93A37F] ring-offset-1' : ''}
      contentEditable={enabled}
      suppressContentEditableWarning
      onBlur={(e) => setProp((p: any) => p.text = e.currentTarget.innerText)}
    >
      {text}
    </div>
  );
};
Text.craft = { displayName: 'Text', props: { text: 'Text', fontSize: 16, color: '#000', fontWeight: 'normal' } };

const Image = ({ url, width, borderRadius, marginTop, alt }: any) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));
  const { enabled } = useEditor((s) => ({ enabled: s.options.enabled }));
  return (
    <div
      ref={(dom: any) => connect(drag(dom))}
      style={{ marginTop: `${marginTop || 0}px`, zIndex: 2, position: 'relative', width: width || '100%' }}
      className={enabled && selected ? 'ring-2 ring-[#93A37F]' : ''}
    >
      <img
        src={url || 'https://placehold.co/800x400/e2e8f0/94a3b8?text=Image'}
        style={{ width: '100%', borderRadius: `${borderRadius || 0}px`, display: 'block' }}
        alt={alt || 'Widget image'}
      />
    </div>
  );
};
Image.craft = { displayName: 'Image', props: { url: '', width: '100%', borderRadius: 0 } };

const Button = ({ text, bg, color, paddingX, paddingY, borderRadius, fontSize, fontWeight }: any) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));
  const { enabled } = useEditor((s) => ({ enabled: s.options.enabled }));
  return (
    <button
      ref={(dom: any) => connect(drag(dom))}
      style={{
        background: bg || '#93A37F',
        color: color || '#FFF',
        padding: `${paddingY || 12}px ${paddingX || 28}px`,
        borderRadius: `${borderRadius || 6}px`,
        fontWeight: fontWeight || 'bold',
        fontSize: `${fontSize || 14}px`,
        zIndex: 2,
        position: 'relative',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-block',
      }}
      className={enabled && selected ? 'ring-2 ring-[#93A37F] ring-offset-2' : ''}
    >
      {text || 'Button'}
    </button>
  );
};
Button.craft = { displayName: 'Button', props: { text: 'Click Me', bg: '#93A37F', color: '#FFF' } };

const Divider = ({ color, thickness, marginTop, marginBottom }: any) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));
  const { enabled } = useEditor((s) => ({ enabled: s.options.enabled }));
  return (
    <div
      ref={(dom: any) => connect(drag(dom))}
      style={{
        width: '100%',
        height: `${thickness || 2}px`,
        background: color || '#E2E8F0',
        marginTop: `${marginTop || 8}px`,
        marginBottom: `${marginBottom || 8}px`,
        zIndex: 2,
        position: 'relative',
      }}
      className={enabled && selected ? 'ring-1 ring-[#93A37F]' : ''}
    />
  );
};
Divider.craft = { displayName: 'Divider', props: { color: '#E2E8F0', thickness: 2 } };

const Container = ({
  children, background, padding, flexDir, alignItems, justifyContent,
  gap, borderRadius, minHeight, topShape, bottomShape, shapeColor, width,
}: any) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));
  const { enabled } = useEditor((s) => ({ enabled: s.options.enabled }));
  return (
    <div
      ref={(dom: any) => connect(drag(dom))}
      style={{
        background: background || 'transparent',
        padding: `${padding || 0}px`,
        display: 'flex',
        flexDirection: flexDir || 'column',
        alignItems: alignItems || 'center',
        justifyContent: justifyContent || 'flex-start',
        gap: `${gap || 0}px`,
        borderRadius: `${borderRadius || 0}px`,
        minHeight: `${minHeight || 20}px`,
        width: width || '100%',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
      className={enabled && selected ? 'ring-2 ring-[#93A37F] ring-inset' : ''}
    >
      {topShape && <ShapeDivider type={topShape} position="top" fill={shapeColor || '#FFF'} />}
      {bottomShape && <ShapeDivider type={bottomShape} position="bottom" fill={shapeColor || '#FFF'} />}
      <div style={{
        zIndex: 2,
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: flexDir || 'column',
        alignItems: alignItems || 'center',
        justifyContent: justifyContent || 'flex-start',
        gap: `${gap || 0}px`,
        flexWrap: 'wrap',
      }}>
        {children}
      </div>
    </div>
  );
};
Container.craft = {
  displayName: 'Container',
  props: { background: '#F8FAFC', padding: 40, minHeight: 80 },
  rules: { canMoveIn: () => true },
};

const resolver = { Text, Container, Image, Button, Divider };

// ─── 50 BUSINESS TEMPLATES ────────────────────────────────────────────────────

const BIZ_LIST: Biz[] = [
  { id: 0,  n: "NOVELCO AC",        s: "Premium Aircon Services",        a: "#93A37F", c: "HVAC" },
  { id: 1,  n: "ARVIN TECH",        s: "IT Support & Biometrics",        a: "#3B82F6", c: "IT" },
  { id: 2,  n: "KUYA ARCH",         s: "HRIS & Payroll Systems",         a: "#10B981", c: "SOFTWARE" },
  { id: 3,  n: "METRO COOL",        s: "Industrial Ventilation",         a: "#F59E0B", c: "VENT" },
  { id: 4,  n: "VALENZUELA FAB",    s: "Kitchen Hood Specialist",        a: "#EF4444", c: "FAB" },
  { id: 5,  n: "NOVA DENTAL",       s: "Smile Transformation Experts",   a: "#60A5FA", c: "DENTAL" },
  { id: 6,  n: "IRON & GRACE",      s: "Fitness Studio & Coaching",      a: "#F97316", c: "GYM" },
  { id: 7,  n: "BLOOM EVENTS",      s: "Weddings & Corporate Socials",   a: "#EC4899", c: "EVENTS" },
  { id: 8,  n: "SKYLINE REALTY",    s: "Metro Properties & Leasing",     a: "#6366F1", c: "REALTY" },
  { id: 9,  n: "CRISP LAUNDRY",     s: "Same-Day Wash & Fold",           a: "#14B8A6", c: "LAUNDRY" },
  { id: 10, n: "ALAS LOGISTICS",    s: "Freight & Last-Mile Delivery",   a: "#78716C", c: "LOGISTICS" },
  { id: 11, n: "LUTO NI LOLA",      s: "Authentic Filipino Catering",    a: "#D97706", c: "FOOD" },
  { id: 12, n: "PIXEL STUDIO",      s: "Branding & Graphic Design",      a: "#8B5CF6", c: "DESIGN" },
  { id: 13, n: "GUARDIA SECURITY",  s: "CCTV & Access Control",          a: "#1E293B", c: "SECURITY" },
  { id: 14, n: "SOLANA SOLAR",      s: "Solar Panel Installation",       a: "#FBBF24", c: "SOLAR" },
  { id: 15, n: "PRESYO PRINTS",     s: "Tarpaulin & Signage Printing",   a: "#F43F5E", c: "PRINT" },
  { id: 16, n: "KLINIKA NI DOK",    s: "General Medicine & Check-Ups",   a: "#22C55E", c: "MEDICAL" },
  { id: 17, n: "URBAN CUTS",        s: "Barbershop & Grooming Lounge",   a: "#0EA5E9", c: "BARBER" },
  { id: 18, n: "CODEBASE PH",       s: "Web & App Development",          a: "#A855F7", c: "DEV" },
  { id: 19, n: "VERDE FARMS",       s: "Organic Produce & Delivery",     a: "#4ADE80", c: "AGRI" },
  { id: 20, n: "TAYO TUTORS",       s: "Academic Review & Coaching",     a: "#38BDF8", c: "EDUC" },
  { id: 21, n: "MALAKAS GYM",       s: "24/7 Open Gym & Training",       a: "#FB923C", c: "FITNESS" },
  { id: 22, n: "DALI DALI RUSH",    s: "Express Courier City-Wide",      a: "#FACC15", c: "COURIER" },
  { id: 23, n: "BATO CONSTRUCTION", s: "Civil & Structural Works",       a: "#92400E", c: "CIVIL" },
  { id: 24, n: "LINIS MASTERS",     s: "Deep Cleaning & Sanitation",     a: "#2DD4BF", c: "CLEANING" },
  { id: 25, n: "SPARKS ELECTRIC",   s: "Electrical & Wiring Services",   a: "#EAB308", c: "ELECTRICAL" },
  { id: 26, n: "AGUA PURIFIED",     s: "Water Refilling Station",        a: "#7DD3FC", c: "WATER" },
  { id: 27, n: "PETCARE PH",        s: "Veterinary & Pet Grooming",      a: "#F9A8D4", c: "VET" },
  { id: 28, n: "SAOG AUTOWORKS",    s: "Car Repair & Detailing",         a: "#6B7280", c: "AUTO" },
  { id: 29, n: "LAKBAY TRAVEL",     s: "Domestic Tour Packages",         a: "#34D399", c: "TRAVEL" },
  { id: 30, n: "KOPYA CENTER",      s: "Printing, Copying & Binding",    a: "#C084FC", c: "PRINT" },
  { id: 31, n: "SINING ARTS",       s: "Art Classes & Craft Studio",     a: "#FB7185", c: "ARTS" },
  { id: 32, n: "MATANGLAWIN CCTV",  s: "Remote Monitoring Solutions",    a: "#374151", c: "TECH" },
  { id: 33, n: "PINOY PALENGKE",    s: "Online Grocery & Wet Market",    a: "#65A30D", c: "GROCERY" },
  { id: 34, n: "EXCEL ACCOUNTING",  s: "Bookkeeping & BIR Filing",       a: "#1D4ED8", c: "FINANCE" },
  { id: 35, n: "SIGLA WELLNESS",    s: "Massage & Spa Therapies",        a: "#E879F9", c: "WELLNESS" },
  { id: 36, n: "FIESTA SOUNDS",     s: "Sound System & DJ Services",     a: "#F59E0B", c: "EVENTS" },
  { id: 37, n: "TINDERO ONLINE",    s: "E-Commerce Store Builder",       a: "#0284C7", c: "ECOMM" },
  { id: 38, n: "ANGAT LENDING",     s: "Fast Micro-Loans & Savings",     a: "#059669", c: "FINANCE" },
  { id: 39, n: "SUKA VINEGAR CO.",  s: "Artisanal Condiments & Sauce",   a: "#BE185D", c: "FOOD" },
  { id: 40, n: "HANDA CATERING",    s: "Buffet & Corporate Meals",       a: "#B45309", c: "FOOD" },
  { id: 41, n: "TECHFIX HUB",       s: "Phone & Laptop Repair",          a: "#0F766E", c: "TECH" },
  { id: 42, n: "AGILA DRONES",      s: "Aerial Photography & Survey",    a: "#7C3AED", c: "TECH" },
  { id: 43, n: "TUBERO EXPRESS",    s: "Plumbing & Pipe Works",          a: "#0369A1", c: "PLUMBING" },
  { id: 44, n: "LAKBAY FREIGHT",    s: "Balikbayan Box & Air Cargo",     a: "#DC2626", c: "CARGO" },
  { id: 45, n: "GAWA NG KAMAY",     s: "Custom Furniture & Woodwork",    a: "#78350F", c: "CRAFTS" },
  { id: 46, n: "LUNTIAN ECO",       s: "Landscaping & Garden Design",    a: "#15803D", c: "GARDEN" },
  { id: 47, n: "LIGA SPORTS",       s: "Sports Equipment & Training",    a: "#B91C1C", c: "SPORTS" },
  { id: 48, n: "BUKAS PHARMACY",    s: "24-Hour Drugstore & Wellness",   a: "#0891B2", c: "PHARMA" },
  { id: 49, n: "TANGGAP LAW",       s: "Legal Consultation & Notary",    a: "#1E3A5F", c: "LEGAL" },
];

// ─── 50 UNIQUE LAYOUT GENERATORS ─────────────────────────────────────────────

const layouts: Array<(b: Biz) => object> = [
  // 0 — Dark Hero + Curve Divider
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#1E1E1E",padding:0}, nodes:["h","body","foot"] },
    h:    { type:{resolvedName:"Container"}, props:{background:"#1E1E1E",padding:100,gap:20,bottomShape:"curve",shapeColor:"#F8FAFC"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:68,color:"#FFFFFF",fontWeight:"900"}, parent:"h" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:b.a}, parent:"h" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Get Started",bg:b.a,paddingX:32,paddingY:14,borderRadius:50,fontSize:14}, parent:"h" },
    body: { type:{resolvedName:"Container"}, props:{background:"#F8FAFC",padding:80,gap:20}, parent:"ROOT", nodes:["bt"] },
    bt:   { type:{resolvedName:"Text"}, props:{text:`Trusted ${b.c} provider in Valenzuela City.`,fontSize:16,color:"#64748B"}, parent:"body" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#111",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:12,color:"#555"}, parent:"foot" },
  }),

  // 1 — Horizontal Split
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FFF",padding:0}, nodes:["row","foot"] },
    row:  { type:{resolvedName:"Container"}, props:{flexDir:"row",padding:0,alignItems:"stretch",gap:0,minHeight:600}, parent:"ROOT", nodes:["left","right"] },
    left: { type:{resolvedName:"Container"}, props:{background:b.a,padding:80,gap:20,minHeight:600,alignItems:"flex-start"}, parent:"row", nodes:["tag","t1","t2","btn"] },
    right:{ type:{resolvedName:"Container"}, props:{background:"#FFF",padding:80,gap:16,alignItems:"flex-start"}, parent:"row", nodes:["t3","t4"] },
    tag:  { type:{resolvedName:"Container"}, props:{background:"rgba(255,255,255,0.2)",padding:8,borderRadius:4}, parent:"left", nodes:["tt"] },
    tt:   { type:{resolvedName:"Text"}, props:{text:b.c,fontSize:10,color:"#FFF",fontWeight:"900"}, parent:"tag" },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:52,color:"#FFF",fontWeight:"900",textAlign:"left"}, parent:"left" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:16,color:"rgba(255,255,255,0.8)",textAlign:"left"}, parent:"left" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Learn More →",bg:"#FFF",color:b.a,paddingX:24,paddingY:10,borderRadius:6,fontSize:13}, parent:"left" },
    t3:   { type:{resolvedName:"Text"}, props:{text:"Why Choose Us",fontSize:28,color:"#1E293B",fontWeight:"900",textAlign:"left"}, parent:"right" },
    t4:   { type:{resolvedName:"Text"}, props:{text:`We deliver world-class ${b.c} solutions tailored for every client in Metro Manila.`,fontSize:15,color:"#64748B",textAlign:"left"}, parent:"right" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#F1F5F9",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`${b.n} · Valenzuela City`,fontSize:11,color:"#94A3B8"}, parent:"foot" },
  }),

  // 2 — White Card + Accent Line
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#F1F5F9",padding:60,gap:30}, nodes:["card","cards"] },
    card: { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:80,borderRadius:20,gap:20}, parent:"ROOT", nodes:["t1","line","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:44,color:"#1E293B",fontWeight:"900"}, parent:"card" },
    line: { type:{resolvedName:"Divider"}, props:{color:b.a,thickness:4,marginTop:0,marginBottom:0}, parent:"card" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:18,color:"#64748B"}, parent:"card" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Book Appointment",bg:b.a,paddingX:28,paddingY:12,borderRadius:8}, parent:"card" },
    cards:{ type:{resolvedName:"Container"}, props:{flexDir:"row",gap:16,padding:0}, parent:"ROOT", nodes:["c1","c2","c3"] },
    c1:   { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:30,borderRadius:12,gap:8}, parent:"cards", nodes:["cl1","cv1"] },
    c2:   { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:30,borderRadius:12,gap:8}, parent:"cards", nodes:["cl2","cv2"] },
    c3:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:30,borderRadius:12,gap:8}, parent:"cards", nodes:["cl3","cv3"] },
    cl1:  { type:{resolvedName:"Text"}, props:{text:"Happy Clients",fontSize:10,color:"#64748B",fontWeight:"bold"}, parent:"c1" },
    cv1:  { type:{resolvedName:"Text"}, props:{text:"500+",fontSize:36,color:"#1E293B",fontWeight:"900"}, parent:"c1" },
    cl2:  { type:{resolvedName:"Text"}, props:{text:"Years Active",fontSize:10,color:"#64748B",fontWeight:"bold"}, parent:"c2" },
    cv2:  { type:{resolvedName:"Text"}, props:{text:"10+",fontSize:36,color:"#1E293B",fontWeight:"900"}, parent:"c2" },
    cl3:  { type:{resolvedName:"Text"}, props:{text:"Projects Done",fontSize:10,color:"#FFF",fontWeight:"bold"}, parent:"c3" },
    cv3:  { type:{resolvedName:"Text"}, props:{text:"1,200",fontSize:36,color:"#FFF",fontWeight:"900"}, parent:"c3" },
  }),

  // 3 — Neon on Black
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#000",padding:0}, nodes:["hero","band"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"#000",padding:120,gap:24}, parent:"ROOT", nodes:["badge","t1","t2","btn"] },
    badge:{ type:{resolvedName:"Container"}, props:{background:"transparent",padding:8,borderRadius:4}, parent:"hero", nodes:["bt"] },
    bt:   { type:{resolvedName:"Text"}, props:{text:`[ ${b.c} ]`,fontSize:12,color:b.a,fontWeight:"900",letterSpacing:4}, parent:"badge" },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:80,color:b.a,fontWeight:"900"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:22,color:"#888"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"CONTACT NOW",bg:b.a,color:"#000",paddingX:36,paddingY:14,borderRadius:0,fontSize:12,fontWeight:"900"}, parent:"hero" },
    band: { type:{resolvedName:"Container"}, props:{background:"#111",padding:20}, parent:"ROOT", nodes:["bandt"] },
    bandt:{ type:{resolvedName:"Text"}, props:{text:`VALENZUELA CITY · ${b.c} SPECIALISTS · EST. 2010`,fontSize:10,color:"#444",fontWeight:"bold",letterSpacing:3}, parent:"band" },
  }),

  // 4 — Pastel Stacked Sections
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FFF7ED",padding:0}, nodes:["s1","s2","s3","s4"] },
    s1:   { type:{resolvedName:"Container"}, props:{background:"#FFF7ED",padding:100,gap:16,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    s2:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:50,topShape:"slant",shapeColor:"#FFF7ED"}, parent:"ROOT", nodes:["t3"] },
    s3:   { type:{resolvedName:"Container"}, props:{background:"#1E1E1E",padding:60,gap:12,flexDir:"row"}, parent:"ROOT", nodes:["f1","f2","f3"] },
    s4:   { type:{resolvedName:"Container"}, props:{background:"#111",padding:20}, parent:"ROOT", nodes:["t4"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:60,color:"#1E1E1E",fontWeight:"900",textAlign:"left"}, parent:"s1" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:18,color:"#555",textAlign:"left"}, parent:"s1" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Our Services",bg:"#1E1E1E",color:"#FFF",paddingX:28,paddingY:12,borderRadius:6}, parent:"s1" },
    t3:   { type:{resolvedName:"Text"}, props:{text:`Serving all of Metro Manila`,fontSize:18,color:"#FFF",fontWeight:"bold"}, parent:"s2" },
    f1:   { type:{resolvedName:"Container"}, props:{background:"rgba(255,255,255,0.05)",padding:30,borderRadius:8,gap:8}, parent:"s3", nodes:["f1t","f1s"] },
    f2:   { type:{resolvedName:"Container"}, props:{background:"rgba(255,255,255,0.05)",padding:30,borderRadius:8,gap:8}, parent:"s3", nodes:["f2t","f2s"] },
    f3:   { type:{resolvedName:"Container"}, props:{background:"rgba(255,255,255,0.05)",padding:30,borderRadius:8,gap:8}, parent:"s3", nodes:["f3t","f3s"] },
    f1t:  { type:{resolvedName:"Text"}, props:{text:"Quality",fontSize:14,color:b.a,fontWeight:"bold"}, parent:"f1" },
    f1s:  { type:{resolvedName:"Text"}, props:{text:"Always top-tier service.",fontSize:12,color:"#888"}, parent:"f1" },
    f2t:  { type:{resolvedName:"Text"}, props:{text:"Speed",fontSize:14,color:b.a,fontWeight:"bold"}, parent:"f2" },
    f2s:  { type:{resolvedName:"Text"}, props:{text:"Fast turnaround guaranteed.",fontSize:12,color:"#888"}, parent:"f2" },
    f3t:  { type:{resolvedName:"Text"}, props:{text:"Trust",fontSize:14,color:b.a,fontWeight:"bold"}, parent:"f3" },
    f3s:  { type:{resolvedName:"Text"}, props:{text:"Decades of experience.",fontSize:12,color:"#888"}, parent:"f3" },
    t4:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n} · Valenzuela City`,fontSize:11,color:"#555"}, parent:"s4" },
  }),

  // 5 — Vintage Badge style
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FDF6EC",padding:60,gap:0}, nodes:["outer"] },
    outer:{ type:{resolvedName:"Container"}, props:{background:"#FDF6EC",padding:60,borderRadius:20,gap:16}, parent:"ROOT", nodes:["rule1","t1","rule2","t2","t3","btn","rule3"] },
    rule1:{ type:{resolvedName:"Divider"}, props:{color:b.a,thickness:3}, parent:"outer" },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:52,color:"#7C2D12",fontWeight:"900"}, parent:"outer" },
    rule2:{ type:{resolvedName:"Divider"}, props:{color:"#D97706",thickness:1}, parent:"outer" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:18,color:"#92400E"}, parent:"outer" },
    t3:   { type:{resolvedName:"Text"}, props:{text:b.c.toUpperCase(),fontSize:11,color:"#D97706",fontWeight:"bold",letterSpacing:4}, parent:"outer" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Learn More",bg:"#7C2D12",color:"#FDF6EC",paddingX:28,paddingY:12,borderRadius:4}, parent:"outer" },
    rule3:{ type:{resolvedName:"Divider"}, props:{color:b.a,thickness:3}, parent:"outer" },
  }),

  // 6 — Bold Stripe Top
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FFF",padding:0}, nodes:["stripe","hero","footer"] },
    stripe:{ type:{resolvedName:"Container"}, props:{background:b.a,padding:18,flexDir:"row",gap:20,alignItems:"center"}, parent:"ROOT", nodes:["st1","st2"] },
    st1:  { type:{resolvedName:"Text"}, props:{text:b.c.toUpperCase(),fontSize:10,color:"#FFF",fontWeight:"900",letterSpacing:2}, parent:"stripe" },
    st2:  { type:{resolvedName:"Text"}, props:{text:"VALENZUELA CITY · METRO MANILA",fontSize:10,color:"rgba(255,255,255,0.7)"}, parent:"stripe" },
    hero: { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:100,gap:24,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:64,color:"#111",fontWeight:"900",textAlign:"left"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#555",textAlign:"left"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Contact Us",bg:b.a,paddingX:30,paddingY:13,borderRadius:6}, parent:"hero" },
    footer:{ type:{resolvedName:"Container"}, props:{background:"#F4F4F4",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#999"}, parent:"footer" },
  }),

  // 7 — Dark Side Accent Bar
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#0F172A",padding:0}, nodes:["row","foot"] },
    row:  { type:{resolvedName:"Container"}, props:{flexDir:"row",padding:0,alignItems:"stretch",gap:0,minHeight:600}, parent:"ROOT", nodes:["accent","main"] },
    accent:{ type:{resolvedName:"Container"}, props:{background:b.a,padding:20,minHeight:600,gap:20,alignItems:"center",justifyContent:"flex-end"}, parent:"row", nodes:["at"] },
    at:   { type:{resolvedName:"Text"}, props:{text:b.c,fontSize:9,color:"rgba(255,255,255,0.7)",fontWeight:"bold",letterSpacing:2}, parent:"accent" },
    main: { type:{resolvedName:"Container"}, props:{background:"#0F172A",padding:100,gap:24,alignItems:"flex-start"}, parent:"row", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:60,color:"#F8FAFC",fontWeight:"900",textAlign:"left"}, parent:"main" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#94A3B8",textAlign:"left"}, parent:"main" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Get a Quote",bg:b.a,paddingX:28,paddingY:12,borderRadius:6}, parent:"main" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#020617",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`${b.n} · ${b.c}`,fontSize:10,color:"#334155"}, parent:"foot" },
  }),

  // 8 — Frosted Glass on Color BG
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:b.a,padding:80,gap:30}, nodes:["glass","stats"] },
    glass:{ type:{resolvedName:"Container"}, props:{background:"rgba(255,255,255,0.2)",padding:80,borderRadius:24,gap:20}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:56,color:"#FFF",fontWeight:"900"}, parent:"glass" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"rgba(255,255,255,0.85)"}, parent:"glass" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Learn More",bg:"#FFF",color:b.a,paddingX:28,paddingY:12,borderRadius:50}, parent:"glass" },
    stats:{ type:{resolvedName:"Container"}, props:{background:"rgba(0,0,0,0.15)",padding:40,borderRadius:16,flexDir:"row",gap:30}, parent:"ROOT", nodes:["s1","s2","s3"] },
    s1:   { type:{resolvedName:"Container"}, props:{background:"transparent",padding:0,gap:4}, parent:"stats", nodes:["s1l","s1v"] },
    s2:   { type:{resolvedName:"Container"}, props:{background:"transparent",padding:0,gap:4}, parent:"stats", nodes:["s2l","s2v"] },
    s3:   { type:{resolvedName:"Container"}, props:{background:"transparent",padding:0,gap:4}, parent:"stats", nodes:["s3l","s3v"] },
    s1l:  { type:{resolvedName:"Text"}, props:{text:"Clients",fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:"bold"}, parent:"s1" },
    s1v:  { type:{resolvedName:"Text"}, props:{text:"500+",fontSize:32,color:"#FFF",fontWeight:"900"}, parent:"s1" },
    s2l:  { type:{resolvedName:"Text"}, props:{text:"Projects",fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:"bold"}, parent:"s2" },
    s2v:  { type:{resolvedName:"Text"}, props:{text:"1,200",fontSize:32,color:"#FFF",fontWeight:"900"}, parent:"s2" },
    s3l:  { type:{resolvedName:"Text"}, props:{text:"Years",fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:"bold"}, parent:"s3" },
    s3v:  { type:{resolvedName:"Text"}, props:{text:"10+",fontSize:32,color:"#FFF",fontWeight:"900"}, parent:"s3" },
  }),

  // 9 — Magazine Full Bleed
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#F9F9F9",padding:0}, nodes:["hero","byline","body"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"#111",padding:120,gap:12,alignItems:"flex-start",bottomShape:"slant",shapeColor:"#F9F9F9"}, parent:"ROOT", nodes:["categ","t1","t2"] },
    categ:{ type:{resolvedName:"Container"}, props:{background:b.a,padding:6,borderRadius:2}, parent:"hero", nodes:["ct"] },
    ct:   { type:{resolvedName:"Text"}, props:{text:b.c,fontSize:10,color:"#FFF",fontWeight:"900",letterSpacing:2}, parent:"categ" },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:88,color:"#FFF",fontWeight:"900",textAlign:"left",lineHeight:0.9}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"rgba(255,255,255,0.6)",textAlign:"left"}, parent:"hero" },
    byline:{ type:{resolvedName:"Container"}, props:{background:b.a,padding:20,flexDir:"row",gap:16,alignItems:"center"}, parent:"ROOT", nodes:["byl"] },
    byl:  { type:{resolvedName:"Text"}, props:{text:`VALENZUELA CITY · THE PREMIER ${b.c.toUpperCase()} PROVIDER`,fontSize:10,color:"#FFF",fontWeight:"bold",letterSpacing:2}, parent:"byline" },
    body: { type:{resolvedName:"Container"}, props:{background:"#F9F9F9",padding:80,gap:16,alignItems:"flex-start"}, parent:"ROOT", nodes:["bt","btn"] },
    bt:   { type:{resolvedName:"Text"}, props:{text:"Trusted by hundreds of businesses and homeowners across Metro Manila.",fontSize:18,color:"#444",textAlign:"left"}, parent:"body" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Read More",bg:"#111",color:"#FFF",paddingX:28,paddingY:12,borderRadius:4}, parent:"body" },
  }),

  // 10 — Gradient Hero
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FFF",padding:0}, nodes:["grad","rest","foot"] },
    grad: { type:{resolvedName:"Container"}, props:{background:`linear-gradient(135deg,${b.a} 0%,#000 100%)`,padding:120,gap:16,bottomShape:"wave",shapeColor:"#FFF"}, parent:"ROOT", nodes:["t1","t2","row"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:68,color:"#FFF",fontWeight:"900"}, parent:"grad" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:22,color:"rgba(255,255,255,0.8)"}, parent:"grad" },
    row:  { type:{resolvedName:"Container"}, props:{flexDir:"row",gap:16,padding:0}, parent:"grad", nodes:["btn1","btn2"] },
    btn1: { type:{resolvedName:"Button"}, props:{text:"Get Started",bg:"#FFF",color:"#1E1E1E",paddingX:28,paddingY:12,borderRadius:50,fontSize:13}, parent:"row" },
    btn2: { type:{resolvedName:"Button"}, props:{text:"Learn More",bg:"transparent",color:"#FFF",paddingX:28,paddingY:12,borderRadius:50,fontSize:13}, parent:"row" },
    rest: { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:80,gap:16}, parent:"ROOT", nodes:["rt"] },
    rt:   { type:{resolvedName:"Text"}, props:{text:`Get in touch with ${b.n} today — Valenzuela City's top ${b.c} company.`,fontSize:18,color:"#555"}, parent:"rest" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#F4F4F4",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#999"}, parent:"foot" },
  }),

  // 11 — Industrial / Brutal
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#E5E5E5",padding:0}, nodes:["topbar","hero","stripe","foot"] },
    topbar:{ type:{resolvedName:"Container"}, props:{background:"#000",padding:12,flexDir:"row",gap:20,alignItems:"center"}, parent:"ROOT", nodes:["tb1","tb2"] },
    tb1:  { type:{resolvedName:"Text"}, props:{text:b.c.toUpperCase(),fontSize:10,color:b.a,fontWeight:"900",letterSpacing:2}, parent:"topbar" },
    tb2:  { type:{resolvedName:"Text"}, props:{text:"VALENZUELA CITY · METRO MANILA · OPEN 24/7",fontSize:10,color:"#FFF"}, parent:"topbar" },
    hero: { type:{resolvedName:"Container"}, props:{background:"#E5E5E5",padding:100,gap:0,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:80,color:"#000",fontWeight:"900",textAlign:"left"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s.toUpperCase(),fontSize:16,color:"#333",textAlign:"left",letterSpacing:2}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"CALL NOW",bg:"#000",color:b.a,paddingX:32,paddingY:14,borderRadius:0,fontSize:13,fontWeight:"900"}, parent:"hero" },
    stripe:{ type:{resolvedName:"Container"}, props:{background:b.a,padding:20}, parent:"ROOT", nodes:["st"] },
    st:   { type:{resolvedName:"Text"}, props:{text:`${b.c} SPECIALISTS · FAST · RELIABLE · AFFORDABLE`,fontSize:11,color:"#FFF",fontWeight:"bold",letterSpacing:3}, parent:"stripe" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#111",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:10,color:"#555"}, parent:"foot" },
  }),

  // 12 — Luxury Dark Gold
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#0D0D0D",padding:0}, nodes:["hero","mid","foot"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"#0D0D0D",padding:100,gap:24}, parent:"ROOT", nodes:["t1","divider","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:60,color:"#D4AF37",fontWeight:"900",letterSpacing:2}, parent:"hero" },
    divider:{ type:{resolvedName:"Divider"}, props:{color:"#D4AF37",thickness:1,marginTop:4,marginBottom:4}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:18,color:"#888"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Inquire Now",bg:"#D4AF37",color:"#000",paddingX:32,paddingY:13,borderRadius:2,fontSize:13,fontWeight:"900"}, parent:"hero" },
    mid:  { type:{resolvedName:"Container"}, props:{background:"#1A1A1A",padding:40,flexDir:"row",gap:40}, parent:"ROOT", nodes:["m1","m2","m3"] },
    m1:   { type:{resolvedName:"Text"}, props:{text:"Excellence",fontSize:13,color:"#D4AF37",fontWeight:"bold"}, parent:"mid" },
    m2:   { type:{resolvedName:"Text"}, props:{text:"·",fontSize:13,color:"#444"}, parent:"mid" },
    m3:   { type:{resolvedName:"Text"}, props:{text:`Premium ${b.c} · Valenzuela City`,fontSize:13,color:"#666"}, parent:"mid" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#0A0A0A",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n} · Since 2010`,fontSize:11,color:"#333"}, parent:"foot" },
  }),

  // 13 — Ocean Layers
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#E0F2FE",padding:0}, nodes:["l1","l2","l3","l4"] },
    l1:   { type:{resolvedName:"Container"}, props:{background:"#BAE6FD",padding:80,gap:12,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    l2:   { type:{resolvedName:"Container"}, props:{background:"#38BDF8",padding:60,topShape:"wave",shapeColor:"#BAE6FD"}, parent:"ROOT", nodes:["t3"] },
    l3:   { type:{resolvedName:"Container"}, props:{background:"#0369A1",padding:50,topShape:"slant",shapeColor:"#38BDF8",flexDir:"row",gap:30}, parent:"ROOT", nodes:["f1","f2","f3"] },
    l4:   { type:{resolvedName:"Container"}, props:{background:"#0C4A6E",padding:24}, parent:"ROOT", nodes:["ft"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:64,color:"#0C4A6E",fontWeight:"900",textAlign:"left"}, parent:"l1" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:18,color:"#075985",textAlign:"left"}, parent:"l1" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Call Us",bg:"#0369A1",color:"#FFF",paddingX:24,paddingY:10,borderRadius:6}, parent:"l1" },
    t3:   { type:{resolvedName:"Text"}, props:{text:`Top-tier ${b.c} in Metro Manila`,fontSize:22,color:"#FFF",fontWeight:"bold"}, parent:"l2" },
    f1:   { type:{resolvedName:"Text"}, props:{text:"✔ Certified",fontSize:14,color:"#BAE6FD",fontWeight:"bold"}, parent:"l3" },
    f2:   { type:{resolvedName:"Text"}, props:{text:"✔ Affordable",fontSize:14,color:"#BAE6FD",fontWeight:"bold"}, parent:"l3" },
    f3:   { type:{resolvedName:"Text"}, props:{text:"✔ Reliable",fontSize:14,color:"#BAE6FD",fontWeight:"bold"}, parent:"l3" },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#1E40AF"}, parent:"l4" },
  }),

  // 14 — Earthy Organic
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FAFAF7",padding:0}, nodes:["hero","band","grid","foot"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"#FAFAF7",padding:100,gap:20,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:60,color:"#3D2B1F",fontWeight:"900",textAlign:"left"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#7C5C4A",textAlign:"left"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Our Story",bg:"#3D2B1F",color:"#FAFAF7",paddingX:28,paddingY:12,borderRadius:50}, parent:"hero" },
    band: { type:{resolvedName:"Container"}, props:{background:b.a,padding:30}, parent:"ROOT", nodes:["bt"] },
    bt:   { type:{resolvedName:"Text"}, props:{text:`Locally rooted in Valenzuela City — Serving with pride since Day 1`,fontSize:14,color:"#FFF"}, parent:"band" },
    grid: { type:{resolvedName:"Container"}, props:{background:"#F5F0E8",padding:60,flexDir:"row",gap:20}, parent:"ROOT", nodes:["g1","g2"] },
    g1:   { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:40,borderRadius:12,gap:8}, parent:"grid", nodes:["g1t","g1s"] },
    g2:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:40,borderRadius:12,gap:8}, parent:"grid", nodes:["g2t","g2s"] },
    g1t:  { type:{resolvedName:"Text"}, props:{text:"Our Mission",fontSize:16,color:"#3D2B1F",fontWeight:"bold",textAlign:"left"}, parent:"g1" },
    g1s:  { type:{resolvedName:"Text"}, props:{text:`Delivering premium ${b.c} with heart and expertise.`,fontSize:13,color:"#7C5C4A",textAlign:"left"}, parent:"g1" },
    g2t:  { type:{resolvedName:"Text"}, props:{text:"Contact Us",fontSize:16,color:"#FFF",fontWeight:"bold",textAlign:"left"}, parent:"g2" },
    g2s:  { type:{resolvedName:"Text"}, props:{text:"Valenzuela City, Metro Manila",fontSize:13,color:"rgba(255,255,255,0.8)",textAlign:"left"}, parent:"g2" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#1C1917",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#57534E"}, parent:"foot" },
  }),

  // 15 — 3-Column Feature Grid
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#F8FAFC",padding:0}, nodes:["hdr","grid","foot"] },
    hdr:  { type:{resolvedName:"Container"}, props:{background:"#1E293B",padding:100,gap:12}, parent:"ROOT", nodes:["ht","hs"] },
    ht:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:48,color:"#F8FAFC",fontWeight:"900"}, parent:"hdr" },
    hs:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:18,color:"#94A3B8"}, parent:"hdr" },
    grid: { type:{resolvedName:"Container"}, props:{flexDir:"row",gap:20,padding:60}, parent:"ROOT", nodes:["g1","g2","g3"] },
    g1:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:40,borderRadius:12,gap:12,minHeight:180}, parent:"grid", nodes:["g1t","g1s","g1b"] },
    g2:   { type:{resolvedName:"Container"}, props:{background:"#1E293B",padding:40,borderRadius:12,gap:12,minHeight:180}, parent:"grid", nodes:["g2t","g2s","g2b"] },
    g3:   { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:40,borderRadius:12,gap:12,minHeight:180}, parent:"grid", nodes:["g3t","g3s","g3b"] },
    g1t:  { type:{resolvedName:"Text"}, props:{text:"Quality Work",fontSize:18,color:"#FFF",fontWeight:"900",textAlign:"left"}, parent:"g1" },
    g1s:  { type:{resolvedName:"Text"}, props:{text:"Industry-leading standards.",fontSize:12,color:"rgba(255,255,255,0.8)",textAlign:"left"}, parent:"g1" },
    g1b:  { type:{resolvedName:"Button"}, props:{text:"Learn More",bg:"#FFF",color:b.a,paddingX:16,paddingY:8,borderRadius:4,fontSize:11}, parent:"g1" },
    g2t:  { type:{resolvedName:"Text"}, props:{text:"Fast Service",fontSize:18,color:"#FFF",fontWeight:"900",textAlign:"left"}, parent:"g2" },
    g2s:  { type:{resolvedName:"Text"}, props:{text:"Same-day available.",fontSize:12,color:"#94A3B8",textAlign:"left"}, parent:"g2" },
    g2b:  { type:{resolvedName:"Button"}, props:{text:"Book Now",bg:b.a,color:"#FFF",paddingX:16,paddingY:8,borderRadius:4,fontSize:11}, parent:"g2" },
    g3t:  { type:{resolvedName:"Text"}, props:{text:"Affordable",fontSize:18,color:"#1E293B",fontWeight:"900",textAlign:"left"}, parent:"g3" },
    g3s:  { type:{resolvedName:"Text"}, props:{text:"Best prices in the area.",fontSize:12,color:"#64748B",textAlign:"left"}, parent:"g3" },
    g3b:  { type:{resolvedName:"Button"}, props:{text:"Get Quote",bg:"#1E293B",color:"#FFF",paddingX:16,paddingY:8,borderRadius:4,fontSize:11}, parent:"g3" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#0F172A",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n} · Valenzuela City`,fontSize:11,color:"#334155"}, parent:"foot" },
  }),

  // 16 — Retro Arcade
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#0D0221",padding:0}, nodes:["scanline","hero","ticker"] },
    scanline:{ type:{resolvedName:"Container"}, props:{background:"#0D0221",padding:16,flexDir:"row",gap:12,alignItems:"center"}, parent:"ROOT", nodes:["dot","tit"] },
    dot:  { type:{resolvedName:"Container"}, props:{background:b.a,padding:6,borderRadius:999,minHeight:12}, parent:"scanline", nodes:[] },
    tit:  { type:{resolvedName:"Text"}, props:{text:`${b.c.toUpperCase()} · ONLINE`,fontSize:10,color:b.a,fontWeight:"900",letterSpacing:3}, parent:"scanline" },
    hero: { type:{resolvedName:"Container"}, props:{background:"#0D0221",padding:100,gap:20}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:`>>> ${b.n} <<<`,fontSize:52,color:b.a,fontWeight:"900",letterSpacing:2}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s.toUpperCase(),fontSize:16,color:"#0FF",letterSpacing:3}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"[ PRESS START ]",bg:b.a,color:"#000",paddingX:32,paddingY:14,borderRadius:0,fontSize:12,fontWeight:"900"}, parent:"hero" },
    ticker:{ type:{resolvedName:"Container"}, props:{background:"#111",padding:14,flexDir:"row",gap:40}, parent:"ROOT", nodes:["tk1","tk2"] },
    tk1:  { type:{resolvedName:"Text"}, props:{text:`VALENZUELA CITY · ${b.c}`,fontSize:10,color:"#0FF",fontWeight:"bold",letterSpacing:2}, parent:"ticker" },
    tk2:  { type:{resolvedName:"Text"}, props:{text:"HIGH SCORE: 9,999",fontSize:10,color:b.a,fontWeight:"bold"}, parent:"ticker" },
  }),

  // 17 — Monochrome Typographic
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FFF",padding:0}, nodes:["top","main","bot"] },
    top:  { type:{resolvedName:"Container"}, props:{background:"#000",padding:14,flexDir:"row",gap:20,alignItems:"center"}, parent:"ROOT", nodes:["tt1","tt2"] },
    tt1:  { type:{resolvedName:"Text"}, props:{text:b.c.toUpperCase(),fontSize:10,color:"#FFF",fontWeight:"900",letterSpacing:3}, parent:"top" },
    tt2:  { type:{resolvedName:"Text"}, props:{text:"Valenzuela City",fontSize:10,color:"#666"}, parent:"top" },
    main: { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:100,gap:8,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1","rule","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:96,color:"#000",fontWeight:"900",textAlign:"left",lineHeight:0.9}, parent:"main" },
    rule: { type:{resolvedName:"Divider"}, props:{color:"#000",thickness:3,marginTop:16,marginBottom:8}, parent:"main" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:22,color:"#333",textAlign:"left"}, parent:"main" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Contact →",bg:"#000",color:"#FFF",paddingX:28,paddingY:12,borderRadius:0,fontSize:13,fontWeight:"900"}, parent:"main" },
    bot:  { type:{resolvedName:"Container"}, props:{background:"#F4F4F4",padding:28}, parent:"ROOT", nodes:["bt"] },
    bt:   { type:{resolvedName:"Text"}, props:{text:"Valenzuela City, Metro Manila",fontSize:12,color:"#999"}, parent:"bot" },
  }),

  // 18 — Dashboard Stats
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#F8FAFC",padding:0}, nodes:["nav","body","foot"] },
    nav:  { type:{resolvedName:"Container"}, props:{background:"#1E293B",padding:18,flexDir:"row",alignItems:"center",gap:20}, parent:"ROOT", nodes:["nt","nc","nb"] },
    nt:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:13,color:"#FFF",fontWeight:"900"}, parent:"nav" },
    nc:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:5,borderRadius:4}, parent:"nav", nodes:["nct"] },
    nct:  { type:{resolvedName:"Text"}, props:{text:b.c,fontSize:9,color:"#FFF",fontWeight:"bold"}, parent:"nc" },
    nb:   { type:{resolvedName:"Button"}, props:{text:"Book Now",bg:"transparent",color:b.a,paddingX:14,paddingY:6,borderRadius:4,fontSize:11,fontWeight:"bold"}, parent:"nav" },
    body: { type:{resolvedName:"Container"}, props:{background:"#F8FAFC",padding:60,gap:30}, parent:"ROOT", nodes:["title","cards","sub"] },
    title:{ type:{resolvedName:"Text"}, props:{text:b.s,fontSize:32,color:"#1E293B",fontWeight:"900",textAlign:"left"}, parent:"body" },
    cards:{ type:{resolvedName:"Container"}, props:{flexDir:"row",gap:20,padding:0}, parent:"body", nodes:["c1","c2","c3","c4"] },
    c1:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:28,borderRadius:12,gap:6,minHeight:120}, parent:"cards", nodes:["cl1","cv1"] },
    c2:   { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:28,borderRadius:12,gap:6,minHeight:120}, parent:"cards", nodes:["cl2","cv2"] },
    c3:   { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:28,borderRadius:12,gap:6,minHeight:120}, parent:"cards", nodes:["cl3","cv3"] },
    c4:   { type:{resolvedName:"Container"}, props:{background:"#1E293B",padding:28,borderRadius:12,gap:6,minHeight:120}, parent:"cards", nodes:["cl4","cv4"] },
    cl1:  { type:{resolvedName:"Text"}, props:{text:"Happy Clients",fontSize:9,color:"rgba(255,255,255,0.8)",fontWeight:"bold"}, parent:"c1" },
    cv1:  { type:{resolvedName:"Text"}, props:{text:"500+",fontSize:36,color:"#FFF",fontWeight:"900"}, parent:"c1" },
    cl2:  { type:{resolvedName:"Text"}, props:{text:"Projects Done",fontSize:9,color:"#64748B",fontWeight:"bold"}, parent:"c2" },
    cv2:  { type:{resolvedName:"Text"}, props:{text:"1,200",fontSize:36,color:"#1E293B",fontWeight:"900"}, parent:"c2" },
    cl3:  { type:{resolvedName:"Text"}, props:{text:"Years Active",fontSize:9,color:"#64748B",fontWeight:"bold"}, parent:"c3" },
    cv3:  { type:{resolvedName:"Text"}, props:{text:"10+",fontSize:36,color:"#1E293B",fontWeight:"900"}, parent:"c3" },
    cl4:  { type:{resolvedName:"Text"}, props:{text:"Rating",fontSize:9,color:"rgba(255,255,255,0.6)",fontWeight:"bold"}, parent:"c4" },
    cv4:  { type:{resolvedName:"Text"}, props:{text:"5.0★",fontSize:36,color:"#FFF",fontWeight:"900"}, parent:"c4" },
    sub:  { type:{resolvedName:"Text"}, props:{text:`${b.n} — Your trusted ${b.c} partner in Valenzuela City.`,fontSize:15,color:"#64748B",textAlign:"left"}, parent:"body" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#0F172A",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:10,color:"#334155"}, parent:"foot" },
  }),

  // 19 — Terminal / Code aesthetic
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#011627",padding:0}, nodes:["titlebar","term","foot"] },
    titlebar:{ type:{resolvedName:"Container"}, props:{background:"#1D3042",padding:12,flexDir:"row",gap:8,alignItems:"center"}, parent:"ROOT", nodes:["d1","d2","d3","tf"] },
    d1:   { type:{resolvedName:"Container"}, props:{background:"#FF5F56",padding:5,borderRadius:999,minHeight:12}, parent:"titlebar", nodes:[] },
    d2:   { type:{resolvedName:"Container"}, props:{background:"#FFBD2E",padding:5,borderRadius:999,minHeight:12}, parent:"titlebar", nodes:[] },
    d3:   { type:{resolvedName:"Container"}, props:{background:"#27C93F",padding:5,borderRadius:999,minHeight:12}, parent:"titlebar", nodes:[] },
    tf:   { type:{resolvedName:"Text"}, props:{text:`${b.n.toLowerCase().replace(/ /g,'-')} — terminal`,fontSize:11,color:"#8899AA"}, parent:"titlebar" },
    term: { type:{resolvedName:"Container"}, props:{background:"#011627",padding:60,gap:16,alignItems:"flex-start"}, parent:"ROOT", nodes:["l1","l2","l3","l4","btn"] },
    l1:   { type:{resolvedName:"Text"}, props:{text:"$ whoami",fontSize:14,color:"#7EC8E3",textAlign:"left"}, parent:"term" },
    l2:   { type:{resolvedName:"Text"}, props:{text:`> ${b.n}`,fontSize:36,color:b.a,fontWeight:"900",textAlign:"left"}, parent:"term" },
    l3:   { type:{resolvedName:"Text"}, props:{text:`$ cat services.txt`,fontSize:14,color:"#7EC8E3",textAlign:"left"}, parent:"term" },
    l4:   { type:{resolvedName:"Text"}, props:{text:`> ${b.s}`,fontSize:18,color:"#CCD6F6",textAlign:"left"}, parent:"term" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"$ ./contact.sh",bg:"transparent",color:b.a,paddingX:0,paddingY:8,borderRadius:0,fontSize:16,fontWeight:"bold"}, parent:"term" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#020C1B",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:"// Valenzuela City · Metro Manila",fontSize:11,color:"#1D3042"}, parent:"foot" },
  }),

  // 20 — Sunset Gradient
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FFF",padding:0}, nodes:["hero","white","foot"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"linear-gradient(180deg,#FF6B6B 0%,#FE8B3F 50%,#FEE140 100%)",padding:120,gap:20,bottomShape:"slantAlt",shapeColor:"#FFF"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:72,color:"#FFF",fontWeight:"900"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:22,color:"rgba(255,255,255,0.9)"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Book a Session",bg:"#FFF",color:"#FF6B6B",paddingX:32,paddingY:13,borderRadius:50,fontSize:13,fontWeight:"bold"}, parent:"hero" },
    white:{ type:{resolvedName:"Container"}, props:{background:"#FFF",padding:80,gap:16}, parent:"ROOT", nodes:["wt"] },
    wt:   { type:{resolvedName:"Text"}, props:{text:`Bringing warmth and excellence to every ${b.c} project in Valenzuela City.`,fontSize:18,color:"#555"}, parent:"white" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#FFF7ED",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:b.c,fontSize:11,color:"#FB923C",fontWeight:"bold"}, parent:"foot" },
  }),

  // 21 — Arctic Blue
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#EFF6FF",padding:0}, nodes:["hero","cards","foot"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"#1E40AF",padding:100,gap:20,bottomShape:"curve",shapeColor:"#EFF6FF"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:64,color:"#DBEAFE",fontWeight:"900"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#93C5FD"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Get Started",bg:"#DBEAFE",color:"#1E40AF",paddingX:28,paddingY:12,borderRadius:50,fontSize:13,fontWeight:"bold"}, parent:"hero" },
    cards:{ type:{resolvedName:"Container"}, props:{flexDir:"row",gap:20,padding:60}, parent:"ROOT", nodes:["ca","cb","cc"] },
    ca:   { type:{resolvedName:"Container"}, props:{background:"#BFDBFE",padding:40,borderRadius:12,gap:8}, parent:"cards", nodes:["cat","cas"] },
    cb:   { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:40,borderRadius:12,gap:8}, parent:"cards", nodes:["cbt","cbs"] },
    cc:   { type:{resolvedName:"Container"}, props:{background:"#1E40AF",padding:40,borderRadius:12,gap:8}, parent:"cards", nodes:["cct","ccs"] },
    cat:  { type:{resolvedName:"Text"}, props:{text:"Our Mission",fontSize:14,color:"#1D4ED8",fontWeight:"bold",textAlign:"left"}, parent:"ca" },
    cas:  { type:{resolvedName:"Text"}, props:{text:`Excellence in ${b.c}.`,fontSize:12,color:"#1E40AF",textAlign:"left"}, parent:"ca" },
    cbt:  { type:{resolvedName:"Text"}, props:{text:"Location",fontSize:14,color:"#1D4ED8",fontWeight:"bold",textAlign:"left"}, parent:"cb" },
    cbs:  { type:{resolvedName:"Text"}, props:{text:"Valenzuela City, MM",fontSize:12,color:"#555",textAlign:"left"}, parent:"cb" },
    cct:  { type:{resolvedName:"Text"}, props:{text:"Contact Us",fontSize:14,color:"#93C5FD",fontWeight:"bold",textAlign:"left"}, parent:"cc" },
    ccs:  { type:{resolvedName:"Button"}, props:{text:"Call Now",bg:"#93C5FD",color:"#1E3A8A",paddingX:16,paddingY:8,borderRadius:4,fontSize:11}, parent:"cc" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#1E40AF",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#93C5FD"}, parent:"foot" },
  }),

  // 22 — Forest Green
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#052E16",padding:0}, nodes:["h","m","f"] },
    h:    { type:{resolvedName:"Container"}, props:{background:"#052E16",padding:100,gap:20,bottomShape:"triangle",shapeColor:"#14532D"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:68,color:"#DCFCE7",fontWeight:"900"}, parent:"h" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#86EFAC"}, parent:"h" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Grow With Us",bg:"#86EFAC",color:"#052E16",paddingX:28,paddingY:12,borderRadius:50,fontSize:13,fontWeight:"bold"}, parent:"h" },
    m:    { type:{resolvedName:"Container"}, props:{background:"#14532D",padding:60,gap:12,flexDir:"row"}, parent:"ROOT", nodes:["f1","f2","f3"] },
    f1:   { type:{resolvedName:"Text"}, props:{text:"🌿 Eco-Friendly",fontSize:14,color:"#BBF7D0",fontWeight:"bold"}, parent:"m" },
    f2:   { type:{resolvedName:"Text"}, props:{text:"🌿 Sustainable",fontSize:14,color:"#BBF7D0",fontWeight:"bold"}, parent:"m" },
    f3:   { type:{resolvedName:"Text"}, props:{text:"🌿 Community-First",fontSize:14,color:"#BBF7D0",fontWeight:"bold"}, parent:"m" },
    f:    { type:{resolvedName:"Container"}, props:{background:"#000",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n} · Valenzuela City`,fontSize:11,color:"#166534"}, parent:"f" },
  }),

  // 23 — Purple Haze
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#2E1065",padding:0}, nodes:["hero","strip","foot"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"linear-gradient(135deg,#2E1065 0%,#6D28D9 100%)",padding:100,gap:24,bottomShape:"slant",shapeColor:"#581C87"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:68,color:"#E9D5FF",fontWeight:"900"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#C4B5FD"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Explore Services",bg:"#E9D5FF",color:"#4C1D95",paddingX:28,paddingY:12,borderRadius:50,fontSize:13,fontWeight:"bold"}, parent:"hero" },
    strip:{ type:{resolvedName:"Container"}, props:{background:"#581C87",padding:50,gap:20}, parent:"ROOT", nodes:["st","stb"] },
    st:   { type:{resolvedName:"Text"}, props:{text:`Premium ${b.c} · Valenzuela City`,fontSize:18,color:"#DDD6FE",fontWeight:"bold"}, parent:"strip" },
    stb:  { type:{resolvedName:"Button"}, props:{text:"Book Now",bg:b.a,color:"#FFF",paddingX:28,paddingY:11,borderRadius:6,fontSize:13}, parent:"strip" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#1E0B3B",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#581C87"}, parent:"foot" },
  }),

  // 24 — Coral & Ivory
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FFF8F0",padding:0}, nodes:["nav","hero","features","foot"] },
    nav:  { type:{resolvedName:"Container"}, props:{background:"#FF6B6B",padding:16,flexDir:"row",alignItems:"center",gap:20}, parent:"ROOT", nodes:["nt","nb"] },
    nt:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:13,color:"#FFF",fontWeight:"900"}, parent:"nav" },
    nb:   { type:{resolvedName:"Button"}, props:{text:"Contact",bg:"#FFF",color:"#FF6B6B",paddingX:16,paddingY:7,borderRadius:50,fontSize:11,fontWeight:"bold"}, parent:"nav" },
    hero: { type:{resolvedName:"Container"}, props:{background:"#FFF8F0",padding:100,gap:20,bottomShape:"wave",shapeColor:"#FFE4E6"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:64,color:"#FF6B6B",fontWeight:"900"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#7C3A3A"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Get in Touch",bg:"#FF6B6B",color:"#FFF",paddingX:28,paddingY:12,borderRadius:50,fontSize:13}, parent:"hero" },
    features:{ type:{resolvedName:"Container"}, props:{background:"#FFE4E6",padding:60,flexDir:"row",gap:20}, parent:"ROOT", nodes:["fe1","fe2","fe3"] },
    fe1:  { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:30,borderRadius:12,gap:6}, parent:"features", nodes:["fe1t","fe1s"] },
    fe2:  { type:{resolvedName:"Container"}, props:{background:"#FF6B6B",padding:30,borderRadius:12,gap:6}, parent:"features", nodes:["fe2t","fe2s"] },
    fe3:  { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:30,borderRadius:12,gap:6}, parent:"features", nodes:["fe3t","fe3s"] },
    fe1t: { type:{resolvedName:"Text"}, props:{text:"Experience",fontSize:14,color:"#FF6B6B",fontWeight:"bold"}, parent:"fe1" },
    fe1s: { type:{resolvedName:"Text"}, props:{text:"10+ years in the industry.",fontSize:12,color:"#7C3A3A"}, parent:"fe1" },
    fe2t: { type:{resolvedName:"Text"}, props:{text:"Speed",fontSize:14,color:"#FFF",fontWeight:"bold"}, parent:"fe2" },
    fe2s: { type:{resolvedName:"Text"}, props:{text:"Same-day service available.",fontSize:12,color:"rgba(255,255,255,0.8)"}, parent:"fe2" },
    fe3t: { type:{resolvedName:"Text"}, props:{text:"Certified",fontSize:14,color:"#FF6B6B",fontWeight:"bold"}, parent:"fe3" },
    fe3s: { type:{resolvedName:"Text"}, props:{text:"Licensed & insured.",fontSize:12,color:"#7C3A3A"}, parent:"fe3" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#FF6B6B",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n} — ${b.c}`,fontSize:11,color:"#FFE0E0"}, parent:"foot" },
  }),

  // 25 — Cyberpunk Yellow/Black
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#000",padding:0}, nodes:["warn","hero","sub","foot"] },
    warn: { type:{resolvedName:"Container"}, props:{background:"#FACC15",padding:10,flexDir:"row",gap:20}, parent:"ROOT", nodes:["wt"] },
    wt:   { type:{resolvedName:"Text"}, props:{text:`⚡ ${b.c.toUpperCase()} ⚡ VALENZUELA CITY ⚡ ${b.c.toUpperCase()} ⚡ CALL NOW ⚡`,fontSize:10,color:"#000",fontWeight:"900",letterSpacing:2}, parent:"warn" },
    hero: { type:{resolvedName:"Container"}, props:{background:"#000",padding:100,gap:16,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:80,color:"#FACC15",fontWeight:"900",textAlign:"left"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#FFF",textAlign:"left"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"⚡ BOOK NOW",bg:"#FACC15",color:"#000",paddingX:32,paddingY:14,borderRadius:0,fontSize:13,fontWeight:"900"}, parent:"hero" },
    sub:  { type:{resolvedName:"Container"}, props:{background:"#111",padding:40,flexDir:"row",gap:30}, parent:"ROOT", nodes:["s1","s2","s3"] },
    s1:   { type:{resolvedName:"Text"}, props:{text:"FAST",fontSize:14,color:"#FACC15",fontWeight:"bold"}, parent:"sub" },
    s2:   { type:{resolvedName:"Text"}, props:{text:"RELIABLE",fontSize:14,color:"#FACC15",fontWeight:"bold"}, parent:"sub" },
    s3:   { type:{resolvedName:"Text"}, props:{text:"AFFORDABLE",fontSize:14,color:"#FACC15",fontWeight:"bold"}, parent:"sub" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#0A0A0A",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n} · NEXT LEVEL SERVICE`,fontSize:10,color:"#444"}, parent:"foot" },
  }),

  // 26 — Material Dark
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#121212",padding:0}, nodes:["appbar","surface","cards","foot"] },
    appbar:{ type:{resolvedName:"Container"}, props:{background:"#1F1F1F",padding:16,flexDir:"row",alignItems:"center",gap:16}, parent:"ROOT", nodes:["at","ab","abtn"] },
    at:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:15,color:"#FFF",fontWeight:"bold"}, parent:"appbar" },
    ab:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:5,borderRadius:4}, parent:"appbar", nodes:["abt"] },
    abt:  { type:{resolvedName:"Text"}, props:{text:b.c,fontSize:9,color:"#FFF",fontWeight:"bold"}, parent:"ab" },
    abtn: { type:{resolvedName:"Button"}, props:{text:"Contact",bg:"transparent",color:b.a,paddingX:14,paddingY:6,borderRadius:4,fontSize:11,fontWeight:"bold"}, parent:"appbar" },
    surface:{ type:{resolvedName:"Container"}, props:{background:"#121212",padding:80,gap:24,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1","t2"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:52,color:"#E8EAED",fontWeight:"900",textAlign:"left"}, parent:"surface" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#9AA0A6",textAlign:"left"}, parent:"surface" },
    cards:{ type:{resolvedName:"Container"}, props:{background:"#1F1F1F",padding:40,gap:16,flexDir:"row"}, parent:"ROOT", nodes:["c1","c2"] },
    c1:   { type:{resolvedName:"Container"}, props:{background:"#2C2C2C",padding:30,borderRadius:12,gap:8}, parent:"cards", nodes:["c1t","c1s","c1b"] },
    c2:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:30,borderRadius:12,gap:8}, parent:"cards", nodes:["c2t","c2s","c2b"] },
    c1t:  { type:{resolvedName:"Text"}, props:{text:"About Us",fontSize:16,color:"#E8EAED",fontWeight:"bold",textAlign:"left"}, parent:"c1" },
    c1s:  { type:{resolvedName:"Text"}, props:{text:"Valenzuela City's premier service provider.",fontSize:13,color:"#9AA0A6",textAlign:"left"}, parent:"c1" },
    c1b:  { type:{resolvedName:"Button"}, props:{text:"Read More",bg:"transparent",color:b.a,paddingX:0,paddingY:6,borderRadius:0,fontSize:12,fontWeight:"bold"}, parent:"c1" },
    c2t:  { type:{resolvedName:"Text"}, props:{text:"Book Now",fontSize:16,color:"#FFF",fontWeight:"bold",textAlign:"left"}, parent:"c2" },
    c2s:  { type:{resolvedName:"Text"}, props:{text:"Fast and reliable service guaranteed.",fontSize:13,color:"rgba(255,255,255,0.8)",textAlign:"left"}, parent:"c2" },
    c2b:  { type:{resolvedName:"Button"}, props:{text:"Schedule →",bg:"#FFF",color:b.a,paddingX:16,paddingY:8,borderRadius:4,fontSize:12,fontWeight:"bold"}, parent:"c2" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#0A0A0A",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n} · Valenzuela City`,fontSize:10,color:"#333"}, parent:"foot" },
  }),

  // 27 — Sci-Fi Blueprint
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#0A192F",padding:0}, nodes:["header","body","footer"] },
    header:{ type:{resolvedName:"Container"}, props:{background:"#112240",padding:18,flexDir:"row",alignItems:"center",gap:20}, parent:"ROOT", nodes:["hlt","hrt","hbtn"] },
    hlt:  { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:13,color:"#64FFDA",fontWeight:"900"}, parent:"header" },
    hrt:  { type:{resolvedName:"Text"}, props:{text:b.c,fontSize:10,color:"#8892B0"}, parent:"header" },
    hbtn: { type:{resolvedName:"Button"}, props:{text:"[ Contact ]",bg:"transparent",color:"#64FFDA",paddingX:14,paddingY:6,borderRadius:2,fontSize:11,fontWeight:"bold"}, parent:"header" },
    body: { type:{resolvedName:"Container"}, props:{background:"#0A192F",padding:100,gap:24,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1","line","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:64,color:"#CCD6F6",fontWeight:"900",textAlign:"left"}, parent:"body" },
    line: { type:{resolvedName:"Divider"}, props:{color:"#64FFDA",thickness:2,marginTop:4,marginBottom:4}, parent:"body" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#8892B0",textAlign:"left"}, parent:"body" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Initialize Contact",bg:"transparent",color:"#64FFDA",paddingX:20,paddingY:10,borderRadius:2,fontSize:13,fontWeight:"bold"}, parent:"body" },
    footer:{ type:{resolvedName:"Container"}, props:{background:"#020C1B",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:"SYSTEM ONLINE · VALENZUELA CITY",fontSize:10,color:"#64FFDA",letterSpacing:2}, parent:"footer" },
  }),

  // 28 — Newspaper Editorial
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#F5F0E8",padding:0}, nodes:["masthead","fold","body","foot"] },
    masthead:{ type:{resolvedName:"Container"}, props:{background:"#F5F0E8",padding:30,gap:4,alignItems:"center"}, parent:"ROOT", nodes:["ms","mt","md"] },
    ms:   { type:{resolvedName:"Text"}, props:{text:"THE VALENZUELA HERALD",fontSize:10,color:"#555",fontWeight:"bold",letterSpacing:3}, parent:"masthead" },
    mt:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:72,color:"#1A1A1A",fontWeight:"900"}, parent:"masthead" },
    md:   { type:{resolvedName:"Divider"}, props:{color:"#1A1A1A",thickness:2}, parent:"masthead" },
    fold: { type:{resolvedName:"Container"}, props:{background:"#1A1A1A",padding:4,minHeight:4}, parent:"ROOT", nodes:[] },
    body: { type:{resolvedName:"Container"}, props:{background:"#F5F0E8",padding:60,flexDir:"row",gap:40,alignItems:"flex-start"}, parent:"ROOT", nodes:["col1","divR","col2"] },
    col1: { type:{resolvedName:"Container"}, props:{background:"transparent",padding:0,gap:16,alignItems:"flex-start"}, parent:"body", nodes:["ct1","cs1","cb1"] },
    divR: { type:{resolvedName:"Divider"}, props:{color:"#1A1A1A",thickness:1,marginTop:0,marginBottom:0}, parent:"body" },
    col2: { type:{resolvedName:"Container"}, props:{background:"transparent",padding:0,gap:12,alignItems:"flex-start"}, parent:"body", nodes:["ct2","cs2","cb2"] },
    ct1:  { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:28,color:"#1A1A1A",fontWeight:"900",textAlign:"left"}, parent:"col1" },
    cs1:  { type:{resolvedName:"Text"}, props:{text:`Est. Valenzuela City — ${b.c} Division. Serving Metro Manila with unrivaled expertise.`,fontSize:13,color:"#555",textAlign:"left"}, parent:"col1" },
    cb1:  { type:{resolvedName:"Button"}, props:{text:"Read More →",bg:"#1A1A1A",color:"#F5F0E8",paddingX:20,paddingY:9,borderRadius:0,fontSize:12}, parent:"col1" },
    ct2:  { type:{resolvedName:"Text"}, props:{text:"Latest News",fontSize:20,color:"#1A1A1A",fontWeight:"bold",textAlign:"left"}, parent:"col2" },
    cs2:  { type:{resolvedName:"Text"}, props:{text:`${b.n} expands operations across Metro Manila to serve more clients than ever before.`,fontSize:13,color:"#555",textAlign:"left"}, parent:"col2" },
    cb2:  { type:{resolvedName:"Button"}, props:{text:"Subscribe",bg:b.a,color:"#FFF",paddingX:20,paddingY:9,borderRadius:2,fontSize:12}, parent:"col2" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#1A1A1A",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n} · Valenzuela City`,fontSize:11,color:"#555"}, parent:"foot" },
  }),

  // 29 — Rose Gold Luxury
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FFF5F0",padding:0}, nodes:["nav","hero","band","cards","foot"] },
    nav:  { type:{resolvedName:"Container"}, props:{background:"#FFF5F0",padding:16,flexDir:"row",alignItems:"center",gap:20}, parent:"ROOT", nodes:["nt","nb"] },
    nt:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:13,color:"#881337",fontWeight:"900"}, parent:"nav" },
    nb:   { type:{resolvedName:"Button"}, props:{text:"Inquire",bg:"#E11D48",color:"#FFF",paddingX:16,paddingY:7,borderRadius:50,fontSize:11}, parent:"nav" },
    hero: { type:{resolvedName:"Container"}, props:{background:"#FFF5F0",padding:100,gap:16,bottomShape:"wave",shapeColor:"#FFE4E6"}, parent:"ROOT", nodes:["tag","t1","t2","btn"] },
    tag:  { type:{resolvedName:"Container"}, props:{background:"#FECDD3",padding:8,borderRadius:999}, parent:"hero", nodes:["tgt"] },
    tgt:  { type:{resolvedName:"Text"}, props:{text:b.c.toUpperCase(),fontSize:10,color:"#9F1239",fontWeight:"bold",letterSpacing:2}, parent:"tag" },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:64,color:"#881337",fontWeight:"900"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#BE123C"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Book Premium",bg:"#E11D48",color:"#FFF",paddingX:32,paddingY:13,borderRadius:50,fontSize:13,fontWeight:"bold"}, parent:"hero" },
    band: { type:{resolvedName:"Container"}, props:{background:"#E11D48",padding:24}, parent:"ROOT", nodes:["bt"] },
    bt:   { type:{resolvedName:"Text"}, props:{text:"Premium Quality · Valenzuela City · Metro Manila",fontSize:13,color:"#FFE4E6"}, parent:"band" },
    cards:{ type:{resolvedName:"Container"}, props:{background:"#FFF",padding:60,flexDir:"row",gap:20}, parent:"ROOT", nodes:["c1","c2","c3"] },
    c1:   { type:{resolvedName:"Container"}, props:{background:"#FFF1F2",padding:40,borderRadius:12,gap:8}, parent:"cards", nodes:["c1t","c1s"] },
    c2:   { type:{resolvedName:"Container"}, props:{background:"#E11D48",padding:40,borderRadius:12,gap:8}, parent:"cards", nodes:["c2t","c2s"] },
    c3:   { type:{resolvedName:"Container"}, props:{background:"#FFF1F2",padding:40,borderRadius:12,gap:8}, parent:"cards", nodes:["c3t","c3s"] },
    c1t:  { type:{resolvedName:"Text"}, props:{text:"Experience",fontSize:14,color:"#9F1239",fontWeight:"bold"}, parent:"c1" },
    c1s:  { type:{resolvedName:"Text"}, props:{text:"10+ years in the business.",fontSize:12,color:"#BE123C"}, parent:"c1" },
    c2t:  { type:{resolvedName:"Text"}, props:{text:"Premium Service",fontSize:14,color:"#FFF",fontWeight:"bold"}, parent:"c2" },
    c2s:  { type:{resolvedName:"Text"}, props:{text:"Industry-leading quality standards.",fontSize:12,color:"rgba(255,255,255,0.8)"}, parent:"c2" },
    c3t:  { type:{resolvedName:"Text"}, props:{text:"Location",fontSize:14,color:"#9F1239",fontWeight:"bold"}, parent:"c3" },
    c3s:  { type:{resolvedName:"Text"}, props:{text:"Valenzuela City, MM",fontSize:12,color:"#BE123C"}, parent:"c3" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#1A0A0E",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#7F1D1D"}, parent:"foot" },
  }),

  // 30–49: More unique layouts
  // 30 — Bold Poster (Full Color)
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:b.a,padding:60,gap:16}, nodes:["t1","rule","t2","t3","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:96,color:"#FFF",fontWeight:"900"}, parent:"ROOT" },
    rule: { type:{resolvedName:"Divider"}, props:{color:"#FFF",thickness:4,marginTop:8,marginBottom:8}, parent:"ROOT" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s.toUpperCase(),fontSize:18,color:"rgba(255,255,255,0.9)",fontWeight:"bold",letterSpacing:3}, parent:"ROOT" },
    t3:   { type:{resolvedName:"Text"}, props:{text:`${b.c} · VALENZUELA CITY, METRO MANILA`,fontSize:12,color:"rgba(255,255,255,0.6)",letterSpacing:2}, parent:"ROOT" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Get Quote Now",bg:"#FFF",color:b.a,paddingX:32,paddingY:14,borderRadius:50,fontSize:14,fontWeight:"bold"}, parent:"ROOT" },
  }),

  // 31 — Stacked Dark Blocks
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#000",padding:0}, nodes:["b1","b2","b3","b4","b5"] },
    b1:   { type:{resolvedName:"Container"}, props:{background:"#000",padding:80,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1"] },
    b2:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:60,topShape:"slant",shapeColor:"#000"}, parent:"ROOT", nodes:["t2","btn"] },
    b3:   { type:{resolvedName:"Container"}, props:{background:"#1A1A1A",padding:60,topShape:"slantAlt",shapeColor:b.a,flexDir:"row",gap:30}, parent:"ROOT", nodes:["f1","f2","f3"] },
    b4:   { type:{resolvedName:"Container"}, props:{background:"#222",padding:50,topShape:"stepped",shapeColor:"#1A1A1A"}, parent:"ROOT", nodes:["t3"] },
    b5:   { type:{resolvedName:"Container"}, props:{background:"#111",padding:20}, parent:"ROOT", nodes:["ft"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:80,color:"#FFF",fontWeight:"900",textAlign:"left"}, parent:"b1" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:28,color:"#FFF",fontWeight:"bold"}, parent:"b2" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Hire Us",bg:"#FFF",color:b.a,paddingX:28,paddingY:12,borderRadius:4,fontSize:13,fontWeight:"bold"}, parent:"b2" },
    f1:   { type:{resolvedName:"Text"}, props:{text:"✔ Quality",fontSize:14,color:"#AAA",fontWeight:"bold"}, parent:"b3" },
    f2:   { type:{resolvedName:"Text"}, props:{text:"✔ Speed",fontSize:14,color:"#AAA",fontWeight:"bold"}, parent:"b3" },
    f3:   { type:{resolvedName:"Text"}, props:{text:"✔ Trust",fontSize:14,color:"#AAA",fontWeight:"bold"}, parent:"b3" },
    t3:   { type:{resolvedName:"Text"}, props:{text:"Serving Valenzuela City",fontSize:18,color:"#666"}, parent:"b4" },
    ft:   { type:{resolvedName:"Text"}, props:{text:b.c,fontSize:11,color:"#555",fontWeight:"bold"}, parent:"b5" },
  }),

  // 32 — Bubblegum Pink
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FDF2F8",padding:0}, nodes:["hero","features","footer"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"#FBCFE8",padding:100,gap:24,bottomShape:"curve",shapeColor:"#FDF2F8"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:64,color:"#9D174D",fontWeight:"900"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#BE185D"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Book Now ♡",bg:"#BE185D",color:"#FFF",paddingX:28,paddingY:12,borderRadius:50,fontSize:13,fontWeight:"bold"}, parent:"hero" },
    features:{ type:{resolvedName:"Container"}, props:{background:"#FDF2F8",padding:60,flexDir:"row",gap:20}, parent:"ROOT", nodes:["fe1","fe2"] },
    fe1:  { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:40,borderRadius:16,gap:8}, parent:"features", nodes:["fe1t","fe1s"] },
    fe2:  { type:{resolvedName:"Container"}, props:{background:"#BE185D",padding:40,borderRadius:16,gap:8}, parent:"features", nodes:["fe2t","fe2s"] },
    fe1t: { type:{resolvedName:"Text"}, props:{text:"Our Promise",fontSize:16,color:"#9D174D",fontWeight:"bold"}, parent:"fe1" },
    fe1s: { type:{resolvedName:"Text"}, props:{text:`Premium ${b.c} with a personal touch.`,fontSize:13,color:"#BE185D"}, parent:"fe1" },
    fe2t: { type:{resolvedName:"Text"}, props:{text:"Contact",fontSize:16,color:"#FFF",fontWeight:"bold"}, parent:"fe2" },
    fe2s: { type:{resolvedName:"Text"}, props:{text:"Valenzuela City, MM",fontSize:13,color:"rgba(255,255,255,0.8)"}, parent:"fe2" },
    footer:{ type:{resolvedName:"Container"}, props:{background:"#F9A8D4",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:b.c,fontSize:12,color:"#9D174D",fontWeight:"bold"}, parent:"footer" },
  }),

  // 33 — Teal & Charcoal
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#134E4A",padding:0}, nodes:["hero","features","foot"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"#134E4A",padding:100,gap:24,bottomShape:"slant",shapeColor:"#0F766E"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:64,color:"#CCFBF1",fontWeight:"900"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:22,color:"#5EEAD4"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Get in Touch",bg:"#5EEAD4",color:"#134E4A",paddingX:28,paddingY:12,borderRadius:50,fontSize:13,fontWeight:"bold"}, parent:"hero" },
    features:{ type:{resolvedName:"Container"}, props:{background:"#0F766E",padding:60,gap:20,flexDir:"row"}, parent:"ROOT", nodes:["f1","f2","f3"] },
    f1:   { type:{resolvedName:"Container"}, props:{background:"rgba(255,255,255,0.08)",padding:30,borderRadius:12,gap:8}, parent:"features", nodes:["f1t","f1s"] },
    f2:   { type:{resolvedName:"Container"}, props:{background:"rgba(255,255,255,0.08)",padding:30,borderRadius:12,gap:8}, parent:"features", nodes:["f2t","f2s"] },
    f3:   { type:{resolvedName:"Container"}, props:{background:"rgba(255,255,255,0.08)",padding:30,borderRadius:12,gap:8}, parent:"features", nodes:["f3t","f3s"] },
    f1t:  { type:{resolvedName:"Text"}, props:{text:"Expert Team",fontSize:14,color:"#5EEAD4",fontWeight:"bold"}, parent:"f1" },
    f1s:  { type:{resolvedName:"Text"}, props:{text:"Licensed professionals.",fontSize:12,color:"#99F6E4"}, parent:"f1" },
    f2t:  { type:{resolvedName:"Text"}, props:{text:"Fast Service",fontSize:14,color:"#5EEAD4",fontWeight:"bold"}, parent:"f2" },
    f2s:  { type:{resolvedName:"Text"}, props:{text:"Same-day availability.",fontSize:12,color:"#99F6E4"}, parent:"f2" },
    f3t:  { type:{resolvedName:"Text"}, props:{text:"Fair Pricing",fontSize:14,color:"#5EEAD4",fontWeight:"bold"}, parent:"f3" },
    f3s:  { type:{resolvedName:"Text"}, props:{text:"No hidden charges.",fontSize:12,color:"#99F6E4"}, parent:"f3" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#042F2E",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`${b.n} · Valenzuela City`,fontSize:12,color:"#5EEAD4"}, parent:"foot" },
  }),

  // 34 — Wine & Cream
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FDF8F0",padding:0}, nodes:["row","footer"] },
    row:  { type:{resolvedName:"Container"}, props:{flexDir:"row",padding:0,alignItems:"stretch",minHeight:600}, parent:"ROOT", nodes:["lc","rc"] },
    lc:   { type:{resolvedName:"Container"}, props:{background:"#7F1D1D",padding:100,gap:24,minHeight:600,alignItems:"flex-start"}, parent:"row", nodes:["t1","t2","btn"] },
    rc:   { type:{resolvedName:"Container"}, props:{background:"#FDF8F0",padding:80,gap:20,alignItems:"flex-start"}, parent:"row", nodes:["t3","t4","rb"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:52,color:"#FEF2F2",fontWeight:"900",textAlign:"left"}, parent:"lc" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.c.toUpperCase(),fontSize:11,color:"#FECACA",fontWeight:"bold",textAlign:"left",letterSpacing:3}, parent:"lc" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Contact Now",bg:"#FECACA",color:"#7F1D1D",paddingX:24,paddingY:10,borderRadius:4,fontSize:12,fontWeight:"bold"}, parent:"lc" },
    t3:   { type:{resolvedName:"Text"}, props:{text:"Welcome to",fontSize:16,color:"#92400E",fontWeight:"bold",textAlign:"left"}, parent:"rc" },
    t4:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:28,color:"#7F1D1D",fontWeight:"900",textAlign:"left"}, parent:"rc" },
    rb:   { type:{resolvedName:"Text"}, props:{text:"Locally trusted · Valenzuela City · Metro Manila",fontSize:13,color:"#A16207",textAlign:"left"}, parent:"rc" },
    footer:{ type:{resolvedName:"Container"}, props:{background:"#450A0A",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n} · Est. for You`,fontSize:12,color:"#FCA5A5"}, parent:"footer" },
  }),

  // 35 — Aurora Borealis
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#020617",padding:0}, nodes:["aurora","content","foot"] },
    aurora:{ type:{resolvedName:"Container"}, props:{background:"linear-gradient(135deg,#0F172A 0%,#164E63 30%,#134E4A 60%,#1E1B4B 100%)",padding:120,gap:24,bottomShape:"curve",shapeColor:"#0A192F"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:72,color:"#F0FDFA",fontWeight:"900"}, parent:"aurora" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:22,color:"#5EEAD4"}, parent:"aurora" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Connect With Us",bg:"#5EEAD4",color:"#0F172A",paddingX:32,paddingY:13,borderRadius:50,fontSize:13,fontWeight:"bold"}, parent:"aurora" },
    content:{ type:{resolvedName:"Container"}, props:{background:"#0A192F",padding:60,gap:20,flexDir:"row"}, parent:"ROOT", nodes:["c1","c2"] },
    c1:   { type:{resolvedName:"Container"}, props:{background:"#112240",padding:40,borderRadius:12,gap:8}, parent:"content", nodes:["c1t","c1s"] },
    c2:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:40,borderRadius:12,gap:8}, parent:"content", nodes:["c2t","c2s"] },
    c1t:  { type:{resolvedName:"Text"}, props:{text:"Our Expertise",fontSize:16,color:"#CCD6F6",fontWeight:"bold",textAlign:"left"}, parent:"c1" },
    c1s:  { type:{resolvedName:"Text"}, props:{text:`Industry-leading ${b.c} solutions.`,fontSize:13,color:"#8892B0",textAlign:"left"}, parent:"c1" },
    c2t:  { type:{resolvedName:"Text"}, props:{text:"Get Started",fontSize:16,color:"#FFF",fontWeight:"bold",textAlign:"left"}, parent:"c2" },
    c2s:  { type:{resolvedName:"Text"}, props:{text:"Valenzuela City · Always Available",fontSize:13,color:"rgba(255,255,255,0.8)",textAlign:"left"}, parent:"c2" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#020617",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n} · Valenzuela City`,fontSize:11,color:"#1E3A5F"}, parent:"foot" },
  }),

  // 36 — Fire & Ice Gradient
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FFF",padding:0}, nodes:["top","bottom","foot"] },
    top:  { type:{resolvedName:"Container"}, props:{background:"linear-gradient(90deg,#EF4444 0%,#F97316 50%,#FBBF24 100%)",padding:100,gap:16,bottomShape:"slantAlt",shapeColor:"#312E81"}, parent:"ROOT", nodes:["t1","t2","btn1"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:68,color:"#FFF",fontWeight:"900"}, parent:"top" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"rgba(255,255,255,0.9)"}, parent:"top" },
    btn1: { type:{resolvedName:"Button"}, props:{text:"Start Now",bg:"#FFF",color:"#EF4444",paddingX:28,paddingY:12,borderRadius:50,fontSize:13,fontWeight:"bold"}, parent:"top" },
    bottom:{ type:{resolvedName:"Container"}, props:{background:"linear-gradient(90deg,#0EA5E9 0%,#6366F1 50%,#8B5CF6 100%)",padding:60,gap:12,flexDir:"row"}, parent:"ROOT", nodes:["bt1","bt2","bt3"] },
    bt1:  { type:{resolvedName:"Text"}, props:{text:"✔ Fast",fontSize:14,color:"#BAE6FD",fontWeight:"bold"}, parent:"bottom" },
    bt2:  { type:{resolvedName:"Text"}, props:{text:"✔ Certified",fontSize:14,color:"#BAE6FD",fontWeight:"bold"}, parent:"bottom" },
    bt3:  { type:{resolvedName:"Text"}, props:{text:"✔ Valenzuela City",fontSize:14,color:"#BAE6FD",fontWeight:"bold"}, parent:"bottom" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#030712",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:b.c,fontSize:11,color:"#374151",fontWeight:"bold"}, parent:"foot" },
  }),

  // 37 — Olive & Bone
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#F5F1E8",padding:0}, nodes:["hero","middle","footer"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"#F5F1E8",padding:100,gap:24,alignItems:"flex-start",bottomShape:"slant",shapeColor:"#3D3400"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:64,color:"#3D3400",fontWeight:"900",textAlign:"left"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#706030",textAlign:"left"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Learn More",bg:"#3D3400",color:"#F5F1E8",paddingX:28,paddingY:12,borderRadius:4,fontSize:13}, parent:"hero" },
    middle:{ type:{resolvedName:"Container"}, props:{background:"#3D3400",padding:60,flexDir:"row",gap:30,topShape:"slant",shapeColor:"#F5F1E8"}, parent:"ROOT", nodes:["m1","m2"] },
    m1:   { type:{resolvedName:"Container"}, props:{background:"rgba(255,255,255,0.08)",padding:30,borderRadius:8,gap:8}, parent:"middle", nodes:["m1t","m1s"] },
    m2:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:30,borderRadius:8,gap:8}, parent:"middle", nodes:["m2t","m2s"] },
    m1t:  { type:{resolvedName:"Text"}, props:{text:"Our Services",fontSize:16,color:"#E0D7A0",fontWeight:"bold",textAlign:"left"}, parent:"m1" },
    m1s:  { type:{resolvedName:"Text"}, props:{text:`Premium ${b.c} solutions.`,fontSize:13,color:"#B8A86A",textAlign:"left"}, parent:"m1" },
    m2t:  { type:{resolvedName:"Text"}, props:{text:"Contact",fontSize:16,color:"#FFF",fontWeight:"bold",textAlign:"left"}, parent:"m2" },
    m2s:  { type:{resolvedName:"Text"}, props:{text:"Valenzuela City",fontSize:13,color:"rgba(255,255,255,0.8)",textAlign:"left"}, parent:"m2" },
    footer:{ type:{resolvedName:"Container"}, props:{background:"#1C1400",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#706030"}, parent:"footer" },
  }),

  // 38 — Bold Side Numbers
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FFF",padding:0}, nodes:["row","foot"] },
    row:  { type:{resolvedName:"Container"}, props:{flexDir:"row",padding:0,alignItems:"stretch",minHeight:600}, parent:"ROOT", nodes:["nums","info"] },
    nums: { type:{resolvedName:"Container"}, props:{background:b.a,padding:60,gap:32,minHeight:600,alignItems:"flex-start"}, parent:"row", nodes:["n1","n2","n3"] },
    n1:   { type:{resolvedName:"Text"}, props:{text:"01",fontSize:72,color:"rgba(255,255,255,0.25)",fontWeight:"900",textAlign:"left"}, parent:"nums" },
    n2:   { type:{resolvedName:"Text"}, props:{text:"02",fontSize:72,color:"rgba(255,255,255,0.25)",fontWeight:"900",textAlign:"left"}, parent:"nums" },
    n3:   { type:{resolvedName:"Text"}, props:{text:"03",fontSize:72,color:"rgba(255,255,255,0.25)",fontWeight:"900",textAlign:"left"}, parent:"nums" },
    info: { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:80,gap:24,alignItems:"flex-start"}, parent:"row", nodes:["t1","t2","t3","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:48,color:"#111",fontWeight:"900",textAlign:"left"}, parent:"info" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:18,color:"#555",textAlign:"left"}, parent:"info" },
    t3:   { type:{resolvedName:"Text"}, props:{text:b.c.toUpperCase(),fontSize:11,color:b.a,fontWeight:"bold",textAlign:"left",letterSpacing:2}, parent:"info" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Get a Quote",bg:b.a,color:"#FFF",paddingX:28,paddingY:12,borderRadius:6,fontSize:13}, parent:"info" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#111",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n} · Valenzuela City`,fontSize:11,color:"#555"}, parent:"foot" },
  }),

  // 39 — Geometric Mosaic
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#F8FAFC",padding:40,gap:20}, nodes:["row1","row2","foot"] },
    row1: { type:{resolvedName:"Container"}, props:{flexDir:"row",gap:20,padding:0}, parent:"ROOT", nodes:["ra","rb"] },
    row2: { type:{resolvedName:"Container"}, props:{flexDir:"row",gap:20,padding:0}, parent:"ROOT", nodes:["rc","rd","re"] },
    ra:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:60,borderRadius:12,gap:8,minHeight:220}, parent:"row1", nodes:["rat","ras","rab"] },
    rb:   { type:{resolvedName:"Container"}, props:{background:"#1E293B",padding:60,borderRadius:12,gap:8,minHeight:220}, parent:"row1", nodes:["rbt"] },
    rc:   { type:{resolvedName:"Container"}, props:{background:"#F1F5F9",padding:50,borderRadius:12,gap:8,minHeight:160}, parent:"row2", nodes:["rct"] },
    rd:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:50,borderRadius:12,gap:8,minHeight:160}, parent:"row2", nodes:["rdt"] },
    re:   { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:50,borderRadius:12,gap:8,minHeight:160}, parent:"row2", nodes:["ret"] },
    rat:  { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:28,color:"#FFF",fontWeight:"900",textAlign:"left"}, parent:"ra" },
    ras:  { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:13,color:"rgba(255,255,255,0.8)",textAlign:"left"}, parent:"ra" },
    rab:  { type:{resolvedName:"Button"}, props:{text:"Book Now",bg:"#FFF",color:b.a,paddingX:20,paddingY:9,borderRadius:6,fontSize:12,fontWeight:"bold"}, parent:"ra" },
    rbt:  { type:{resolvedName:"Text"}, props:{text:b.c.toUpperCase(),fontSize:22,color:"#94A3B8",fontWeight:"bold",textAlign:"left",letterSpacing:2}, parent:"rb" },
    rct:  { type:{resolvedName:"Text"}, props:{text:"Valenzuela City",fontSize:16,color:"#1E293B",fontWeight:"bold",textAlign:"left"}, parent:"rc" },
    rdt:  { type:{resolvedName:"Text"}, props:{text:"Book Now →",fontSize:16,color:"#FFF",fontWeight:"bold",textAlign:"left"}, parent:"rd" },
    ret:  { type:{resolvedName:"Text"}, props:{text:"Call Us →",fontSize:16,color:"#1E293B",fontWeight:"bold",textAlign:"left"}, parent:"re" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#0F172A",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#334155"}, parent:"foot" },
  }),

  // 40 — Minimal White Luxury
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FAFAFA",padding:0}, nodes:["nav","hero","line","body","foot"] },
    nav:  { type:{resolvedName:"Container"}, props:{background:"#FAFAFA",padding:24,flexDir:"row",alignItems:"center",gap:20}, parent:"ROOT", nodes:["nt","nb"] },
    nt:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:14,color:"#0F172A",fontWeight:"900",letterSpacing:1}, parent:"nav" },
    nb:   { type:{resolvedName:"Button"}, props:{text:"Inquire →",bg:"#0F172A",color:"#FFF",paddingX:20,paddingY:8,borderRadius:50,fontSize:11,fontWeight:"bold"}, parent:"nav" },
    hero: { type:{resolvedName:"Container"}, props:{background:"#FAFAFA",padding:100,gap:16,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1","t2"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:80,color:"#0F172A",fontWeight:"900",textAlign:"left",lineHeight:0.9}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:22,color:"#64748B",textAlign:"left"}, parent:"hero" },
    line: { type:{resolvedName:"Divider"}, props:{color:b.a,thickness:6,marginTop:0,marginBottom:0}, parent:"ROOT" },
    body: { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:80,flexDir:"row",gap:30,alignItems:"flex-start"}, parent:"ROOT", nodes:["bc1","bc2"] },
    bc1:  { type:{resolvedName:"Container"}, props:{background:"transparent",padding:0,gap:12,alignItems:"flex-start"}, parent:"body", nodes:["bc1t","bc1s","bc1b"] },
    bc2:  { type:{resolvedName:"Container"}, props:{background:b.a,padding:40,borderRadius:12,gap:12,alignItems:"flex-start"}, parent:"body", nodes:["bc2t","bc2s"] },
    bc1t: { type:{resolvedName:"Text"}, props:{text:"Our Services",fontSize:22,color:"#0F172A",fontWeight:"900",textAlign:"left"}, parent:"bc1" },
    bc1s: { type:{resolvedName:"Text"}, props:{text:`${b.n} provides industry-leading ${b.c} solutions to clients across Metro Manila.`,fontSize:14,color:"#64748B",textAlign:"left"}, parent:"bc1" },
    bc1b: { type:{resolvedName:"Button"}, props:{text:"View All Services",bg:"#0F172A",color:"#FFF",paddingX:22,paddingY:10,borderRadius:50,fontSize:12,fontWeight:"bold"}, parent:"bc1" },
    bc2t: { type:{resolvedName:"Text"}, props:{text:"Contact Us",fontSize:20,color:"#FFF",fontWeight:"bold",textAlign:"left"}, parent:"bc2" },
    bc2s: { type:{resolvedName:"Text"}, props:{text:"Valenzuela City, Metro Manila",fontSize:14,color:"rgba(255,255,255,0.8)",textAlign:"left"}, parent:"bc2" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#0F172A",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n} · ${b.c}`,fontSize:11,color:"#334155"}, parent:"foot" },
  }),

  // 41 — Sky & Sand
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#F0F9FF",padding:0}, nodes:["sky","sand","foot"] },
    sky:  { type:{resolvedName:"Container"}, props:{background:"#0EA5E9",padding:100,gap:24,bottomShape:"wave",shapeColor:"#FEF3C7"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:68,color:"#FFF",fontWeight:"900"}, parent:"sky" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:22,color:"#BAE6FD"}, parent:"sky" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Contact Us",bg:"#FFF",color:"#0369A1",paddingX:28,paddingY:12,borderRadius:50,fontSize:13,fontWeight:"bold"}, parent:"sky" },
    sand: { type:{resolvedName:"Container"}, props:{background:"#FEF3C7",padding:60,gap:20,flexDir:"row"}, parent:"ROOT", nodes:["sa","sb","sc"] },
    sa:   { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:30,borderRadius:12,gap:6}, parent:"sand", nodes:["sat","sav"] },
    sb:   { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:30,borderRadius:12,gap:6}, parent:"sand", nodes:["sbt","sbv"] },
    sc:   { type:{resolvedName:"Container"}, props:{background:"#0EA5E9",padding:30,borderRadius:12,gap:6}, parent:"sand", nodes:["sct","scv"] },
    sat:  { type:{resolvedName:"Text"}, props:{text:"Founded",fontSize:10,color:"#0369A1",fontWeight:"bold"}, parent:"sa" },
    sav:  { type:{resolvedName:"Text"}, props:{text:"2010",fontSize:36,color:"#0C4A6E",fontWeight:"900"}, parent:"sa" },
    sbt:  { type:{resolvedName:"Text"}, props:{text:"Clients",fontSize:10,color:"#0369A1",fontWeight:"bold"}, parent:"sb" },
    sbv:  { type:{resolvedName:"Text"}, props:{text:"800+",fontSize:36,color:"#0C4A6E",fontWeight:"900"}, parent:"sb" },
    sct:  { type:{resolvedName:"Text"}, props:{text:"Rating",fontSize:10,color:"rgba(255,255,255,0.8)",fontWeight:"bold"}, parent:"sc" },
    scv:  { type:{resolvedName:"Text"}, props:{text:"5★",fontSize:36,color:"#FFF",fontWeight:"900"}, parent:"sc" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#0C4A6E",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#7DD3FC"}, parent:"foot" },
  }),

  // 42 — Ink & Paper
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FFFEF2",padding:0}, nodes:["hero","aside","foot"] },
    hero: { type:{resolvedName:"Container"}, props:{flexDir:"row",padding:0,alignItems:"stretch",minHeight:600}, parent:"ROOT", nodes:["left","right"] },
    left: { type:{resolvedName:"Container"}, props:{background:"#1A1A1A",padding:80,gap:24,minHeight:600,alignItems:"flex-start"}, parent:"hero", nodes:["t1","t2","btn"] },
    right:{ type:{resolvedName:"Container"}, props:{background:"#FFFEF2",padding:80,gap:16,alignItems:"flex-start"}, parent:"hero", nodes:["t3","t4"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:48,color:"#FFFEF2",fontWeight:"900",textAlign:"left"}, parent:"left" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.c.toUpperCase(),fontSize:10,color:b.a,fontWeight:"bold",textAlign:"left",letterSpacing:3}, parent:"left" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Call Us",bg:b.a,color:"#FFF",paddingX:24,paddingY:10,borderRadius:4,fontSize:12,fontWeight:"bold"}, parent:"left" },
    t3:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:28,color:"#1A1A1A",fontWeight:"bold",textAlign:"left"}, parent:"right" },
    t4:   { type:{resolvedName:"Text"}, props:{text:"Valenzuela City, Metro Manila",fontSize:14,color:"#555",textAlign:"left"}, parent:"right" },
    aside:{ type:{resolvedName:"Container"}, props:{background:b.a,padding:24}, parent:"ROOT", nodes:["at"] },
    at:   { type:{resolvedName:"Text"}, props:{text:"Call us for a free consultation. Same-day service available.",fontSize:14,color:"#FFF"}, parent:"aside" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#0A0A0A",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#333"}, parent:"foot" },
  }),

  // 43 — Bold Rule Editorial
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#FFFBEB",padding:0}, nodes:["header","rule","body","rfooter"] },
    header:{ type:{resolvedName:"Container"}, props:{background:"#FFFBEB",padding:40,gap:4,alignItems:"flex-start",flexDir:"row",justifyContent:"space-between"}, parent:"ROOT", nodes:["ht","hs"] },
    ht:   { type:{resolvedName:"Text"}, props:{text:b.c.toUpperCase(),fontSize:10,color:b.a,fontWeight:"900",textAlign:"left",letterSpacing:3}, parent:"header" },
    hs:   { type:{resolvedName:"Text"}, props:{text:"Valenzuela City · Since 2010",fontSize:10,color:"#92400E",textAlign:"right"}, parent:"header" },
    rule: { type:{resolvedName:"Container"}, props:{background:b.a,padding:0,minHeight:8}, parent:"ROOT", nodes:[] },
    body: { type:{resolvedName:"Container"}, props:{background:"#FFFBEB",padding:80,gap:24,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1","t2","features","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:72,color:"#1C1917",fontWeight:"900",textAlign:"left"}, parent:"body" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:22,color:"#44403C",textAlign:"left"}, parent:"body" },
    features:{ type:{resolvedName:"Container"}, props:{flexDir:"row",gap:20,padding:0}, parent:"body", nodes:["f1","f2"] },
    f1:   { type:{resolvedName:"Container"}, props:{background:"#FEF3C7",padding:24,borderRadius:8,gap:6}, parent:"features", nodes:["f1t","f1s"] },
    f2:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:24,borderRadius:8,gap:6}, parent:"features", nodes:["f2t","f2s"] },
    f1t:  { type:{resolvedName:"Text"}, props:{text:"Services",fontSize:13,color:"#92400E",fontWeight:"bold",textAlign:"left"}, parent:"f1" },
    f1s:  { type:{resolvedName:"Text"}, props:{text:`Premium ${b.c}`,fontSize:12,color:"#78350F",textAlign:"left"}, parent:"f1" },
    f2t:  { type:{resolvedName:"Text"}, props:{text:"Contact",fontSize:13,color:"#FFF",fontWeight:"bold",textAlign:"left"}, parent:"f2" },
    f2s:  { type:{resolvedName:"Text"}, props:{text:"Valenzuela City",fontSize:12,color:"rgba(255,255,255,0.8)",textAlign:"left"}, parent:"f2" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Book an Appointment",bg:"#1C1917",color:"#FFF",paddingX:28,paddingY:12,borderRadius:4,fontSize:13,fontWeight:"bold"}, parent:"body" },
    rfooter:{ type:{resolvedName:"Container"}, props:{background:"#1C1917",padding:24}, parent:"ROOT", nodes:["rft"] },
    rft:  { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#78716C"}, parent:"rfooter" },
  }),

  // 44 — Crypto/Web3 Dark
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#070B14",padding:0}, nodes:["nav","hero","ticker","foot"] },
    nav:  { type:{resolvedName:"Container"}, props:{background:"#0D1829",padding:18,flexDir:"row",alignItems:"center",gap:20}, parent:"ROOT", nodes:["nt","nb","nlive"] },
    nt:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:14,color:"#FFF",fontWeight:"900"}, parent:"nav" },
    nb:   { type:{resolvedName:"Button"}, props:{text:"Connect →",bg:b.a,color:"#FFF",paddingX:16,paddingY:7,borderRadius:4,fontSize:11,fontWeight:"bold"}, parent:"nav" },
    nlive:{ type:{resolvedName:"Text"}, props:{text:"● LIVE",fontSize:10,color:"#4ADE80",fontWeight:"bold"}, parent:"nav" },
    hero: { type:{resolvedName:"Container"}, props:{background:"#070B14",padding:100,gap:24,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:68,color:"#FFF",fontWeight:"900",textAlign:"left"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#94A3B8",textAlign:"left"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Get Started →",bg:b.a,color:"#FFF",paddingX:28,paddingY:12,borderRadius:4,fontSize:13,fontWeight:"bold"}, parent:"hero" },
    ticker:{ type:{resolvedName:"Container"}, props:{background:"#0D1829",padding:16,flexDir:"row",gap:40}, parent:"ROOT", nodes:["tk1","tk2","tk3"] },
    tk1:  { type:{resolvedName:"Text"}, props:{text:`${b.c} ↑ ONLINE`,fontSize:11,color:"#4ADE80",fontWeight:"bold"}, parent:"ticker" },
    tk2:  { type:{resolvedName:"Text"}, props:{text:"Valenzuela City · LIVE",fontSize:11,color:"#64748B"}, parent:"ticker" },
    tk3:  { type:{resolvedName:"Text"}, props:{text:"Quality Guaranteed ✓",fontSize:11,color:"#4ADE80",fontWeight:"bold"}, parent:"ticker" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#050810",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:10,color:"#1E293B"}, parent:"foot" },
  }),

  // 45 — Mint & Charcoal
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#ECFDF5",padding:0}, nodes:["hero","divBar","content","foot"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"#ECFDF5",padding:100,gap:24,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:64,color:"#064E3B",fontWeight:"900",textAlign:"left"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#047857",textAlign:"left"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Explore Now",bg:"#064E3B",color:"#ECFDF5",paddingX:28,paddingY:12,borderRadius:50,fontSize:13}, parent:"hero" },
    divBar:{ type:{resolvedName:"Container"}, props:{background:"#6EE7B7",padding:0,minHeight:8}, parent:"ROOT", nodes:[] },
    content:{ type:{resolvedName:"Container"}, props:{background:"#1C1917",padding:60,flexDir:"row",gap:24}, parent:"ROOT", nodes:["c1","c2","c3"] },
    c1:   { type:{resolvedName:"Container"}, props:{background:"rgba(255,255,255,0.05)",padding:30,borderRadius:8,gap:8}, parent:"content", nodes:["c1t","c1s"] },
    c2:   { type:{resolvedName:"Container"}, props:{background:"rgba(255,255,255,0.05)",padding:30,borderRadius:8,gap:8}, parent:"content", nodes:["c2t","c2s"] },
    c3:   { type:{resolvedName:"Container"}, props:{background:b.a,padding:30,borderRadius:8,gap:8}, parent:"content", nodes:["c3t","c3s"] },
    c1t:  { type:{resolvedName:"Text"}, props:{text:"Quality",fontSize:14,color:"#6EE7B7",fontWeight:"bold"}, parent:"c1" },
    c1s:  { type:{resolvedName:"Text"}, props:{text:"Top-tier workmanship.",fontSize:12,color:"#888"}, parent:"c1" },
    c2t:  { type:{resolvedName:"Text"}, props:{text:"Reliable",fontSize:14,color:"#6EE7B7",fontWeight:"bold"}, parent:"c2" },
    c2s:  { type:{resolvedName:"Text"}, props:{text:"Always on time.",fontSize:12,color:"#888"}, parent:"c2" },
    c3t:  { type:{resolvedName:"Text"}, props:{text:"Contact",fontSize:14,color:"#FFF",fontWeight:"bold"}, parent:"c3" },
    c3s:  { type:{resolvedName:"Text"}, props:{text:"Valenzuela City",fontSize:12,color:"rgba(255,255,255,0.8)"}, parent:"c3" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#0A0A0A",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#166534"}, parent:"foot" },
  }),

  // 46 — Navy & Gold
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#0A1628",padding:0}, nodes:["hero","middle","foot"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"#0A1628",padding:100,gap:20,alignItems:"flex-start"}, parent:"ROOT", nodes:["t1","t2","rule","t3","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.c.toUpperCase(),fontSize:11,color:"#F59E0B",fontWeight:"bold",textAlign:"left",letterSpacing:4}, parent:"hero" },
    rule: { type:{resolvedName:"Divider"}, props:{color:"#F59E0B",thickness:2,marginTop:4,marginBottom:4}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:64,color:"#FFF",fontWeight:"900",textAlign:"left"}, parent:"hero" },
    t3:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#94A3B8",textAlign:"left"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Inquire Now",bg:"#F59E0B",color:"#0A1628",paddingX:28,paddingY:12,borderRadius:4,fontSize:13,fontWeight:"900"}, parent:"hero" },
    middle:{ type:{resolvedName:"Container"}, props:{background:"#0F2040",padding:60,flexDir:"row",gap:20}, parent:"ROOT", nodes:["m1","m2","m3"] },
    m1:   { type:{resolvedName:"Container"}, props:{background:"rgba(245,158,11,0.1)",padding:30,borderRadius:8,gap:6}, parent:"middle", nodes:["m1t","m1s"] },
    m2:   { type:{resolvedName:"Container"}, props:{background:"rgba(245,158,11,0.1)",padding:30,borderRadius:8,gap:6}, parent:"middle", nodes:["m2t","m2s"] },
    m3:   { type:{resolvedName:"Container"}, props:{background:"#F59E0B",padding:30,borderRadius:8,gap:6}, parent:"middle", nodes:["m3t","m3s"] },
    m1t:  { type:{resolvedName:"Text"}, props:{text:"Expert Team",fontSize:14,color:"#F59E0B",fontWeight:"bold"}, parent:"m1" },
    m1s:  { type:{resolvedName:"Text"}, props:{text:"Licensed professionals.",fontSize:12,color:"#64748B"}, parent:"m1" },
    m2t:  { type:{resolvedName:"Text"}, props:{text:"Fast Service",fontSize:14,color:"#F59E0B",fontWeight:"bold"}, parent:"m2" },
    m2s:  { type:{resolvedName:"Text"}, props:{text:"Same-day availability.",fontSize:12,color:"#64748B"}, parent:"m2" },
    m3t:  { type:{resolvedName:"Text"}, props:{text:"Book Now",fontSize:14,color:"#0A1628",fontWeight:"bold"}, parent:"m3" },
    m3s:  { type:{resolvedName:"Text"}, props:{text:"Valenzuela City",fontSize:12,color:"rgba(10,22,40,0.7)"}, parent:"m3" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#060D18",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#1E3A5F"}, parent:"foot" },
  }),

  // 47 — Burnt Orange & Slate
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#1C1917",padding:0}, nodes:["hero","sections","foot"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"#1C1917",padding:100,gap:16,alignItems:"flex-start",bottomShape:"slant",shapeColor:"#EA580C"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:72,color:"#FFF",fontWeight:"900",textAlign:"left"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#A8A29E",textAlign:"left"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Start Today",bg:"#EA580C",color:"#FFF",paddingX:28,paddingY:12,borderRadius:4,fontSize:13,fontWeight:"bold"}, parent:"hero" },
    sections:{ type:{resolvedName:"Container"}, props:{background:"#EA580C",padding:60,flexDir:"row",gap:20,topShape:"slant",shapeColor:"#1C1917"}, parent:"ROOT", nodes:["s1","s2"] },
    s1:   { type:{resolvedName:"Container"}, props:{background:"rgba(255,255,255,0.1)",padding:40,borderRadius:8,gap:8}, parent:"sections", nodes:["s1t","s1s"] },
    s2:   { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:40,borderRadius:8,gap:8}, parent:"sections", nodes:["s2t","s2s"] },
    s1t:  { type:{resolvedName:"Text"}, props:{text:"Our Services",fontSize:18,color:"#FFF",fontWeight:"bold",textAlign:"left"}, parent:"s1" },
    s1s:  { type:{resolvedName:"Text"}, props:{text:`Premium ${b.c} · Valenzuela City`,fontSize:13,color:"rgba(255,255,255,0.8)",textAlign:"left"}, parent:"s1" },
    s2t:  { type:{resolvedName:"Text"}, props:{text:"Contact Us",fontSize:18,color:"#EA580C",fontWeight:"bold",textAlign:"left"}, parent:"s2" },
    s2s:  { type:{resolvedName:"Button"}, props:{text:"Book Now →",bg:"#EA580C",color:"#FFF",paddingX:18,paddingY:9,borderRadius:4,fontSize:12,fontWeight:"bold"}, parent:"s2" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#0C0A09",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#44403C"}, parent:"foot" },
  }),

  // 48 — Lavender Dreams
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#F5F3FF",padding:0}, nodes:["hero","cards","foot"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"#EDE9FE",padding:100,gap:24,bottomShape:"curve",shapeColor:"#F5F3FF"}, parent:"ROOT", nodes:["t1","t2","btn"] },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:64,color:"#4C1D95",fontWeight:"900"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#7C3AED"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Get Started",bg:"#7C3AED",color:"#FFF",paddingX:28,paddingY:12,borderRadius:50,fontSize:13,fontWeight:"bold"}, parent:"hero" },
    cards:{ type:{resolvedName:"Container"}, props:{background:"#F5F3FF",padding:60,flexDir:"row",gap:20}, parent:"ROOT", nodes:["c1","c2","c3"] },
    c1:   { type:{resolvedName:"Container"}, props:{background:"#FFF",padding:40,borderRadius:16,gap:8}, parent:"cards", nodes:["c1t","c1s"] },
    c2:   { type:{resolvedName:"Container"}, props:{background:"#7C3AED",padding:40,borderRadius:16,gap:8}, parent:"cards", nodes:["c2t","c2s"] },
    c3:   { type:{resolvedName:"Container"}, props:{background:"#EDE9FE",padding:40,borderRadius:16,gap:8}, parent:"cards", nodes:["c3t","c3s"] },
    c1t:  { type:{resolvedName:"Text"}, props:{text:"Services",fontSize:16,color:"#4C1D95",fontWeight:"bold"}, parent:"c1" },
    c1s:  { type:{resolvedName:"Text"}, props:{text:`Top ${b.c} in the city.`,fontSize:13,color:"#7C3AED"}, parent:"c1" },
    c2t:  { type:{resolvedName:"Text"}, props:{text:"Book Now",fontSize:16,color:"#FFF",fontWeight:"bold"}, parent:"c2" },
    c2s:  { type:{resolvedName:"Button"}, props:{text:"Schedule →",bg:"#FFF",color:"#7C3AED",paddingX:18,paddingY:8,borderRadius:50,fontSize:12,fontWeight:"bold"}, parent:"c2" },
    c3t:  { type:{resolvedName:"Text"}, props:{text:"Location",fontSize:16,color:"#4C1D95",fontWeight:"bold"}, parent:"c3" },
    c3s:  { type:{resolvedName:"Text"}, props:{text:"Valenzuela City, MM",fontSize:13,color:"#7C3AED"}, parent:"c3" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#2E1065",padding:24}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#6D28D9"}, parent:"foot" },
  }),

  // 49 — Industrial Copper
  (b) => ({
    ROOT: { type:{resolvedName:"Container"}, isCanvas:true, props:{background:"#1C0E00",padding:0}, nodes:["hero","panel","foot"] },
    hero: { type:{resolvedName:"Container"}, props:{background:"#1C0E00",padding:100,gap:20,alignItems:"flex-start"}, parent:"ROOT", nodes:["tag","t1","t2","btn"] },
    tag:  { type:{resolvedName:"Container"}, props:{background:"#B45309",padding:8,borderRadius:2}, parent:"hero", nodes:["tgt"] },
    tgt:  { type:{resolvedName:"Text"}, props:{text:b.c.toUpperCase(),fontSize:10,color:"#FEF3C7",fontWeight:"bold",letterSpacing:3}, parent:"tag" },
    t1:   { type:{resolvedName:"Text"}, props:{text:b.n,fontSize:68,color:"#FEF3C7",fontWeight:"900",textAlign:"left"}, parent:"hero" },
    t2:   { type:{resolvedName:"Text"}, props:{text:b.s,fontSize:20,color:"#D97706",textAlign:"left"}, parent:"hero" },
    btn:  { type:{resolvedName:"Button"}, props:{text:"Get Estimate",bg:"#B45309",color:"#FEF3C7",paddingX:28,paddingY:12,borderRadius:2,fontSize:13,fontWeight:"bold"}, parent:"hero" },
    panel:{ type:{resolvedName:"Container"}, props:{background:"#292524",padding:60,flexDir:"row",gap:20}, parent:"ROOT", nodes:["p1","p2","p3"] },
    p1:   { type:{resolvedName:"Container"}, props:{background:"rgba(180,83,9,0.15)",padding:30,borderRadius:4,gap:8}, parent:"panel", nodes:["p1t","p1s"] },
    p2:   { type:{resolvedName:"Container"}, props:{background:"rgba(180,83,9,0.15)",padding:30,borderRadius:4,gap:8}, parent:"panel", nodes:["p2t","p2s"] },
    p3:   { type:{resolvedName:"Container"}, props:{background:"#B45309",padding:30,borderRadius:4,gap:8}, parent:"panel", nodes:["p3t","p3s"] },
    p1t:  { type:{resolvedName:"Text"}, props:{text:"Fast Work",fontSize:14,color:"#D97706",fontWeight:"bold"}, parent:"p1" },
    p1s:  { type:{resolvedName:"Text"}, props:{text:"Same-day service.",fontSize:12,color:"#78716C"}, parent:"p1" },
    p2t:  { type:{resolvedName:"Text"}, props:{text:"Licensed",fontSize:14,color:"#D97706",fontWeight:"bold"}, parent:"p2" },
    p2s:  { type:{resolvedName:"Text"}, props:{text:"Certified professionals.",fontSize:12,color:"#78716C"}, parent:"p2" },
    p3t:  { type:{resolvedName:"Text"}, props:{text:"Book Now",fontSize:14,color:"#FEF3C7",fontWeight:"bold"}, parent:"p3" },
    p3s:  { type:{resolvedName:"Text"}, props:{text:"Valenzuela City",fontSize:12,color:"rgba(254,243,199,0.7)"}, parent:"p3" },
    foot: { type:{resolvedName:"Container"}, props:{background:"#0C0600",padding:20}, parent:"ROOT", nodes:["ft"] },
    ft:   { type:{resolvedName:"Text"}, props:{text:`© ${b.n}`,fontSize:11,color:"#44403C"}, parent:"foot" },
  }),
];

const getTemplateData = (biz: Biz): string => {
  const fn = layouts[biz.id % layouts.length];
  return JSON.stringify(fn(biz));
};

// ─── SETTINGS PANEL ───────────────────────────────────────────────────────────

const SettingsPanel = () => {
  const { selected, actions } = useEditor((state) => {
    const selectedSet = state.events.selected;
    const id = selectedSet instanceof Set ? [...selectedSet][0] : undefined;
    return {
      selected: id && state.nodes[id]
        ? { id, props: state.nodes[id].data.props, name: state.nodes[id].data.name }
        : null
    };
  });

  if (!selected) return (
    <div className="p-12 text-center text-slate-400 italic text-[10px] uppercase tracking-widest">
      Click any element to edit its properties
    </div>
  );

  const set = (key: string, val: any) => actions.setProp(selected.id, (p: any) => p[key] = val);

  return (
    <div className="p-5">
      <div className="text-[10px] font-black text-slate-800 uppercase mb-6 border-b pb-3 flex items-center justify-between">
        <span>✏ {selected.name}</span>
        <span className="text-[8px] bg-slate-100 px-2 py-0.5 rounded text-slate-400">ID: {selected.id.slice(0,6)}</span>
      </div>

      {/* TEXT SETTINGS */}
      {selected.props.text !== undefined && (
        <section className="mb-6">
          <p className="section-label text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Text & Typography</p>
          <div className="mb-3">
            <label className="text-[10px] text-slate-500 block mb-1">Font Size: {selected.props.fontSize}px</label>
            <input type="range" min="8" max="150" value={selected.props.fontSize || 16}
              onChange={e => set('fontSize', parseInt(e.target.value))} className="w-full accent-[#93A37F]" />
          </div>
          <div className="mb-3">
            <label className="text-[10px] text-slate-500 block mb-1">Font Weight</label>
            <select value={selected.props.fontWeight || 'normal'} onChange={e => set('fontWeight', e.target.value)}
              className="w-full border p-1.5 text-xs rounded">
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="900">Black (900)</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="text-[10px] text-slate-500 block mb-1">Alignment</label>
            <div className="flex gap-1">
              {['left','center','right'].map(a => (
                <button key={a} onClick={() => set('textAlign', a)}
                  className={`flex-1 py-1 text-[10px] rounded border transition ${selected.props.textAlign === a ? 'bg-[#93A37F] text-white border-[#93A37F]' : 'border-slate-200 text-slate-500'}`}>
                  {a[0].toUpperCase()+a.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="text-[10px] text-slate-500 block mb-1">Letter Spacing: {selected.props.letterSpacing || 0}px</label>
            <input type="range" min="0" max="20" value={selected.props.letterSpacing || 0}
              onChange={e => set('letterSpacing', parseInt(e.target.value))} className="w-full accent-[#93A37F]" />
          </div>
          {selected.props.color !== undefined && (
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Text Color</label>
              <input type="color" value={selected.props.color || '#000000'}
                onChange={e => set('color', e.target.value)}
                className="w-full h-8 rounded cursor-pointer border border-slate-200" />
            </div>
          )}
        </section>
      )}

      {/* BUTTON SETTINGS */}
      {selected.name === 'Button' && (
        <section className="mb-6 border-t pt-5">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Button Style</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">BG Color</label>
              <input type="color" value={selected.props.bg || '#93A37F'}
                onChange={e => set('bg', e.target.value)}
                className="w-full h-8 rounded cursor-pointer border border-slate-200" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Text Color</label>
              <input type="color" value={selected.props.color || '#ffffff'}
                onChange={e => set('color', e.target.value)}
                className="w-full h-8 rounded cursor-pointer border border-slate-200" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Pad X</label>
              <input type="number" value={selected.props.paddingX || 24}
                onChange={e => set('paddingX', parseInt(e.target.value))}
                className="w-full border p-1.5 text-xs rounded" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Pad Y</label>
              <input type="number" value={selected.props.paddingY || 12}
                onChange={e => set('paddingY', parseInt(e.target.value))}
                className="w-full border p-1.5 text-xs rounded" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Radius</label>
              <input type="number" value={selected.props.borderRadius || 6}
                onChange={e => set('borderRadius', parseInt(e.target.value))}
                className="w-full border p-1.5 text-xs rounded" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Font Size</label>
              <input type="number" value={selected.props.fontSize || 14}
                onChange={e => set('fontSize', parseInt(e.target.value))}
                className="w-full border p-1.5 text-xs rounded" />
            </div>
          </div>
        </section>
      )}

      {/* IMAGE SETTINGS */}
      {selected.name === 'Image' && (
        <section className="mb-6 border-t pt-5">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Image</p>
          <div className="mb-3">
            <label className="text-[10px] text-slate-500 block mb-1">Image URL</label>
            <input type="text" value={selected.props.url || ''}
              onChange={e => set('url', e.target.value)}
              placeholder="https://..."
              className="w-full border p-1.5 text-xs rounded" />
          </div>
          <div className="mb-3">
            <label className="text-[10px] text-slate-500 block mb-1">Border Radius: {selected.props.borderRadius || 0}px</label>
            <input type="range" min="0" max="100" value={selected.props.borderRadius || 0}
              onChange={e => set('borderRadius', parseInt(e.target.value))} className="w-full accent-[#93A37F]" />
          </div>
        </section>
      )}

      {/* DIVIDER SETTINGS */}
      {selected.name === 'Divider' && (
        <section className="mb-6 border-t pt-5">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Divider</p>
          <div className="mb-3">
            <label className="text-[10px] text-slate-500 block mb-1">Color</label>
            <input type="color" value={selected.props.color || '#E2E8F0'}
              onChange={e => set('color', e.target.value)}
              className="w-full h-8 rounded cursor-pointer border border-slate-200" />
          </div>
          <div className="mb-3">
            <label className="text-[10px] text-slate-500 block mb-1">Thickness: {selected.props.thickness || 2}px</label>
            <input type="range" min="1" max="20" value={selected.props.thickness || 2}
              onChange={e => set('thickness', parseInt(e.target.value))} className="w-full accent-[#93A37F]" />
          </div>
        </section>
      )}

      {/* CONTAINER SETTINGS */}
      {selected.name === 'Container' && (
        <>
          <section className="mb-6 border-t pt-5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Background</p>
            <input type="color" value={(selected.props.background || '#FFFFFF').replace(/linear-gradient.*/,'')}
              onChange={e => set('background', e.target.value)}
              className="w-full h-8 rounded cursor-pointer border border-slate-200" />
          </section>
          <section className="mb-6 border-t pt-5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Layout</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Padding</label>
                <input type="number" value={selected.props.padding || 0}
                  onChange={e => set('padding', parseInt(e.target.value))}
                  className="w-full border p-1.5 text-xs rounded" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Gap</label>
                <input type="number" value={selected.props.gap || 0}
                  onChange={e => set('gap', parseInt(e.target.value))}
                  className="w-full border p-1.5 text-xs rounded" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Radius</label>
                <input type="number" value={selected.props.borderRadius || 0}
                  onChange={e => set('borderRadius', parseInt(e.target.value))}
                  className="w-full border p-1.5 text-xs rounded" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Min Height</label>
                <input type="number" value={selected.props.minHeight || 20}
                  onChange={e => set('minHeight', parseInt(e.target.value))}
                  className="w-full border p-1.5 text-xs rounded" />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-[10px] text-slate-500 block mb-1">Direction</label>
              <div className="flex gap-1">
                {['column','row'].map(d => (
                  <button key={d} onClick={() => set('flexDir', d)}
                    className={`flex-1 py-1 text-[10px] rounded border transition ${selected.props.flexDir === d ? 'bg-[#93A37F] text-white border-[#93A37F]' : 'border-slate-200 text-slate-500'}`}>
                    {d === 'column' ? '↕ Column' : '↔ Row'}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <label className="text-[10px] text-slate-500 block mb-1">Align Items</label>
              <select value={selected.props.alignItems || 'center'} onChange={e => set('alignItems', e.target.value)}
                className="w-full border p-1.5 text-xs rounded">
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="stretch">Stretch</option>
              </select>
            </div>
          </section>
          <section className="border-t pt-5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Shape Dividers</p>
            <div className="mb-3">
              <label className="text-[10px] text-slate-500 block mb-1">Bottom Shape</label>
              <select value={selected.props.bottomShape || ''} onChange={e => set('bottomShape', e.target.value)}
                className="w-full border p-1.5 text-xs rounded">
                <option value="">None (Flat)</option>
                <option value="slant">Slant</option>
                <option value="slantAlt">Slant Alt</option>
                <option value="curve">Curve</option>
                <option value="wave">Wave</option>
                <option value="triangle">Triangle</option>
                <option value="stepped">Stepped</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="text-[10px] text-slate-500 block mb-1">Top Shape</label>
              <select value={selected.props.topShape || ''} onChange={e => set('topShape', e.target.value)}
                className="w-full border p-1.5 text-xs rounded">
                <option value="">None (Flat)</option>
                <option value="slant">Slant</option>
                <option value="slantAlt">Slant Alt</option>
                <option value="curve">Curve</option>
                <option value="wave">Wave</option>
                <option value="triangle">Triangle</option>
                <option value="stepped">Stepped</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Shape Color</label>
              <input type="color" value={selected.props.shapeColor || '#FFFFFF'}
                onChange={e => set('shapeColor', e.target.value)}
                className="w-full h-8 rounded cursor-pointer border border-slate-200" />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

// ─── HEADER ACTIONS ───────────────────────────────────────────────────────────

const HeaderActions = ({ marketplaceId }: { marketplaceId: string }) => {
  const { query, actions } = useEditor();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<false | "draft" | "published">(false);

  // Store actions ref so template sidebar can call deserialize
  useEffect(() => {
    window._editorActions = actions;
  }, [actions]);

  // Load saved draft on mount
  useEffect(() => {
    if (!marketplaceId) return;
    supabase
      .from("marketplace")
      .select("config_draft")
      .eq("id", marketplaceId)
      .single()
      .then(({ data, error }) => {
        if (error) { console.error("Load error:", error); return; }

        const raw = data?.config_draft;
        if (!raw) return;

        try {
          // Supabase jsonb columns come back as a parsed JS object — 
          // CraftJS deserialize() needs a JSON *string*, so re-stringify.
          const craftJson = typeof raw === "string" ? raw : JSON.stringify(raw);

          // Safety check: skip if the payload has no ROOT (e.g. empty default {})
          const parsed = JSON.parse(craftJson);
          if (!parsed.ROOT) {
            console.warn("config_draft has no ROOT node — skipping load");
            return;
          }

          actions.deserialize(craftJson);
        } catch (e) {
          console.error("Failed to deserialize draft:", e);
        }
      });
  }, [marketplaceId]); // intentionally exclude `actions` — it changes every render

  const handleSave = async (publish = false) => {
    setSaving(true);
    try {
      const serialized = query.serialize();

      // Validate before saving — must have a ROOT node
      const parsed = JSON.parse(serialized);
      if (!parsed.ROOT) throw new Error("Canvas is empty — add some content first.");

      // Always save to config_draft so work is never lost
      const updatePayload: Record<string, object> = { config_draft: parsed };

      // When clicking Publish, also push to config_published (the live store)
      if (publish) {
        updatePayload.config_published = parsed;
      }

      const { error } = await supabase
        .from("marketplace")
        .update(updatePayload)
        .eq("id", marketplaceId);

      if (error) throw error;

      setSaved(publish ? "published" : "draft");
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      console.error("Save failed:", e);
      alert(e?.message || "Save failed — check console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Save Draft — preserves work without going live */}
      <button
        onClick={() => handleSave(false)}
        disabled={saving}
        className="px-4 py-2 rounded font-bold text-[10px] tracking-widest bg-slate-700 hover:bg-slate-600 transition-all text-white"
      >
        {saving ? "..." : saved === "draft" ? "✓ SAVED" : "SAVE DRAFT"}
      </button>

      {/* Publish — saves draft AND pushes to live store */}
      <button
        onClick={() => handleSave(true)}
        disabled={saving}
        className={`px-6 py-2 rounded font-black text-[11px] tracking-widest shadow-lg transition-all ${
          saved === "published" ? "bg-green-500" : "bg-[#93A37F] hover:brightness-110"
        }`}
      >
        {saving ? "PUBLISHING..." : saved === "published" ? "✓ PUBLISHED!" : "🚀 PUBLISH"}
      </button>
    </div>
  );
};

// ─── TOOLBOX ITEM ─────────────────────────────────────────────────────────────

const ToolboxItem = ({ name, props, isContainer, isImage, isButton, isDivider }: any) => {
  const { connectors: { create } } = useEditor();
  const getComponent = () => {
    if (isContainer) return <Element is={Container} {...props} canvas />;
    if (isImage) return <Image {...props} />;
    if (isButton) return <Button {...props} />;
    if (isDivider) return <Divider {...props} />;
    return <Text {...props} />;
  };
  return (
    <div
      ref={(dom: any) => { if (dom) create(dom, getComponent()); }}
      className="p-3 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 text-center hover:border-[#93A37F] hover:text-[#93A37F] cursor-grab transition-all bg-white select-none"
    >
      {name}
    </div>
  );
};

// ─── TEMPLATE LIBRARY SIDEBAR ─────────────────────────────────────────────────

const TemplateSidebar = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const categories = ['ALL', ...Array.from(new Set(BIZ_LIST.map(b => b.c)))];
  const filtered = BIZ_LIST.filter(b =>
    (filter === 'ALL' || b.c === filter) &&
    (b.n.toLowerCase().includes(search.toLowerCase()) || b.c.toLowerCase().includes(search.toLowerCase()))
  );

  const loadTemplate = (biz: Biz) => {
    if (!window._editorActions) return;
    try { window._editorActions.deserialize(getTemplateData(biz)); }
    catch (e) { console.error('Template load error', e); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 bg-slate-50 border-b">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">50 Business Templates</p>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#93A37F]"
        />
        <div className="flex flex-wrap gap-1 mt-2">
          {categories.slice(0,8).map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`text-[8px] font-bold px-2 py-0.5 rounded-full transition ${filter === c ? 'bg-[#93A37F] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {filtered.map(biz => (
          <button key={biz.id} onClick={() => loadTemplate(biz)}
            className="w-full text-left p-2.5 border rounded-lg hover:border-[#93A37F] hover:bg-slate-50 transition group flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: biz.a }} />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-700 truncate">{biz.n}</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-tighter">{biz.c}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export default function NovelcoBuilder() {
  const params = useParams();
  const marketplaceId: string = (Array.isArray(params?.id) ? params.id[0] : params?.id) ?? '';
  const [enabled, setEnabled] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'templates' | 'widgets'>('templates');

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden bg-[#F1F5F9]">
      <Editor resolver={resolver} enabled={enabled}>
        {/* ── HEADER ── */}
        <header className="h-14 bg-[#0F172A] text-white flex items-center justify-between px-6 z-30 shadow-2xl flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="font-black text-lg tracking-tighter text-[#93A37F]">
              NOVELCO<span className="text-white">OS</span>
            </div>
            <div className="h-5 w-px bg-white/20" />
            <button
              onClick={() => setEnabled(!enabled)}
              className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                !enabled ? 'bg-[#93A37F] text-white' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {enabled ? '✏ Design' : '👁 Preview'}
            </button>
          </div>
          <HeaderActions marketplaceId={marketplaceId} />
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* ── LEFT SIDEBAR ── */}
          {enabled && (
            <aside className="w-64 bg-white border-r flex flex-col z-20 shadow-xl overflow-hidden flex-shrink-0">
              {/* Tabs */}
              <div className="flex border-b flex-shrink-0">
                <button onClick={() => setSidebarTab('templates')}
                  className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition ${sidebarTab === 'templates' ? 'bg-white text-[#93A37F] border-b-2 border-[#93A37F]' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}>
                  Templates
                </button>
                <button onClick={() => setSidebarTab('widgets')}
                  className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition ${sidebarTab === 'widgets' ? 'bg-white text-[#93A37F] border-b-2 border-[#93A37F]' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}>
                  Widgets
                </button>
              </div>

              {sidebarTab === 'templates' ? (
                <TemplateSidebar />
              ) : (
                <div className="p-3 grid grid-cols-1 gap-2 overflow-y-auto">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Drag onto canvas</p>
                  <ToolboxItem name="✏ Heading" props={{ text: 'Add Heading', fontSize: 36, fontWeight: '900', color: '#0F172A' }} />
                  <ToolboxItem name="✏ Paragraph" props={{ text: 'Add paragraph text here.', fontSize: 16, color: '#555' }} />
                  <ToolboxItem name="🖼 Image" props={{ url: '', width: '100%', borderRadius: 8 }} isImage />
                  <ToolboxItem name="🔘 Button" props={{ text: 'Click Me', bg: '#93A37F', color: '#FFF', paddingX: 28, paddingY: 12, borderRadius: 8, fontSize: 14 }} isButton />
                  <ToolboxItem name="── Divider" props={{ color: '#E2E8F0', thickness: 2 }} isDivider />
                  <ToolboxItem name="▭ Section" props={{ background: '#F8FAFC', padding: 60, borderRadius: 0, minHeight: 100 }} isContainer />
                  <ToolboxItem name="▪ Card" props={{ background: '#FFF', padding: 40, borderRadius: 12, minHeight: 80 }} isContainer />
                  <ToolboxItem name="◧ Dark Box" props={{ background: '#1E293B', padding: 40, borderRadius: 8, minHeight: 80 }} isContainer />
                  <ToolboxItem name="◨ Color Box" props={{ background: '#93A37F', padding: 40, borderRadius: 8, minHeight: 80 }} isContainer />
                </div>
              )}
            </aside>
          )}

          {/* ── CANVAS ── */}
          <main className={`flex-1 overflow-auto transition-all ${enabled ? 'p-12 bg-slate-300' : 'p-0 bg-white'}`}>
            <div className={`mx-auto bg-white transition-all ${
              enabled ? 'shadow-2xl max-w-5xl min-h-[1000px] rounded-xl overflow-hidden border border-slate-200' : 'w-full h-full'
            }`}>
              <Frame>
                <Element is={Container} background="#ffffff" padding={0} canvas>
                  <Container background="#0F172A" padding={120} gap={20} bottomShape="slant" shapeColor="#F8FAFC">
                    <Text text="NOVELCO OS" fontSize={56} fontWeight="900" color="#FFFFFF" />
                    <Text text="← Choose a template or drag widgets from the sidebar" fontSize={18} color="#93A37F" />
                  </Container>
                  <Container background="#F8FAFC" padding={80} gap={16}>
                    <Text text="Start building your business website" fontSize={22} color="#1E293B" fontWeight="bold" />
                    <Text text="50 templates · Drag & drop · Auto-saved to cloud" fontSize={16} color="#64748B" />
                  </Container>
                </Element>
              </Frame>
            </div>
          </main>

          {/* ── RIGHT SETTINGS PANEL ── */}
          {enabled && (
            <aside className="w-72 bg-white border-l z-20 overflow-y-auto shadow-2xl flex-shrink-0">
              <div className="p-3 bg-slate-50 border-b">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Properties</p>
              </div>
              <SettingsPanel />
            </aside>
          )}
        </div>
      </Editor>
    </div>
  );
}