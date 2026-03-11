'use client';

import React, { useEffect, useState } from 'react';
import { Editor, Frame } from '@craftjs/core';
import { supabase } from "@lib/supabase";
import { useParams } from "next/navigation";

// ─── SAME COMPONENTS AS THE EDITOR (read-only, no craft hooks needed for render) ───

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
      position: 'absolute', [position]: 0, left: 0,
      width: '100%', overflow: 'hidden', lineHeight: 0,
      transform: position === 'top' ? 'rotate(180deg)' : 'none',
      zIndex: 1, pointerEvents: 'none',
    }}>
      <svg viewBox="0 0 1000 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '80px' }}>
        {shapes[type]}
      </svg>
    </div>
  );
};

const Text = ({ text, fontSize, color, textAlign, fontWeight, marginTop, marginBottom, letterSpacing, lineHeight }: any) => {
  const { useNode } = require('@craftjs/core');
  const { connectors: { connect } } = useNode();
  return (
    <div ref={connect} style={{
      fontSize: `${fontSize || 16}px`, color: color || '#000',
      textAlign: textAlign || 'center', fontWeight: fontWeight || 'normal',
      marginTop: `${marginTop || 0}px`, marginBottom: `${marginBottom || 0}px`,
      letterSpacing: `${letterSpacing || 0}px`, lineHeight: lineHeight || 1.4,
      zIndex: 2, position: 'relative',
    }}>
      {text}
    </div>
  );
};
Text.craft = { displayName: 'Text' };

const Image = ({ url, width, borderRadius, marginTop }: any) => {
  const { useNode } = require('@craftjs/core');
  const { connectors: { connect } } = useNode();
  return (
    <div ref={connect} style={{ marginTop: `${marginTop || 0}px`, zIndex: 2, position: 'relative', width: width || '100%' }}>
      <img src={url} style={{ width: '100%', borderRadius: `${borderRadius || 0}px`, display: 'block' }} alt="" />
    </div>
  );
};
Image.craft = { displayName: 'Image' };

const Button = ({ text, bg, color, paddingX, paddingY, borderRadius, fontSize, fontWeight }: any) => {
  const { useNode } = require('@craftjs/core');
  const { connectors: { connect } } = useNode();
  return (
    <button ref={connect} style={{
      background: bg || '#93A37F', color: color || '#FFF',
      padding: `${paddingY || 12}px ${paddingX || 28}px`,
      borderRadius: `${borderRadius || 6}px`,
      fontWeight: fontWeight || 'bold', fontSize: `${fontSize || 14}px`,
      zIndex: 2, position: 'relative', border: 'none', cursor: 'pointer',
    }}>
      {text || 'Button'}
    </button>
  );
};
Button.craft = { displayName: 'Button' };

const Divider = ({ color, thickness, marginTop, marginBottom }: any) => {
  const { useNode } = require('@craftjs/core');
  const { connectors: { connect } } = useNode();
  return (
    <div ref={connect} style={{
      width: '100%', height: `${thickness || 2}px`,
      background: color || '#E2E8F0',
      marginTop: `${marginTop || 8}px`, marginBottom: `${marginBottom || 8}px`,
      zIndex: 2, position: 'relative',
    }} />
  );
};
Divider.craft = { displayName: 'Divider' };

const Container = ({ children, background, padding, flexDir, alignItems, justifyContent, gap, borderRadius, minHeight, topShape, bottomShape, shapeColor }: any) => {
  const { useNode } = require('@craftjs/core');
  const { connectors: { connect } } = useNode();
  return (
    <div ref={connect} style={{
      background: background || 'transparent',
      padding: `${padding || 0}px`,
      display: 'flex', flexDirection: flexDir || 'column',
      alignItems: alignItems || 'center',
      justifyContent: justifyContent || 'flex-start',
      gap: `${gap || 0}px`, borderRadius: `${borderRadius || 0}px`,
      minHeight: `${minHeight || 20}px`, width: '100%',
      position: 'relative', overflow: 'hidden', boxSizing: 'border-box',
    }}>
      {topShape && <ShapeDivider type={topShape} position="top" fill={shapeColor || '#FFF'} />}
      {bottomShape && <ShapeDivider type={bottomShape} position="bottom" fill={shapeColor || '#FFF'} />}
      <div style={{
        zIndex: 2, position: 'relative', width: '100%',
        display: 'flex', flexDirection: flexDir || 'column',
        alignItems: alignItems || 'center',
        justifyContent: justifyContent || 'flex-start',
        gap: `${gap || 0}px`, flexWrap: 'wrap',
      }}>
        {children}
      </div>
    </div>
  );
};
Container.craft = { displayName: 'Container', rules: { canMoveIn: () => false } };

const resolver = { Text, Container, Image, Button, Divider };

// ─── STATUS STATES ────────────────────────────────────────────────────────────

const NotPublished = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center p-12 max-w-md">
      <div className="text-6xl mb-4">🏗️</div>
      <h2 className="text-2xl font-black text-slate-800 mb-2">Store Not Published</h2>
      <p className="text-slate-500 text-sm">
        Visit the editor and click <strong>🚀 PUBLISH</strong> to make your store live.
      </p>
      <div className="mt-6 bg-slate-100 rounded-lg p-4 text-left">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Technical Info:</p>
        <pre className="text-xs text-slate-500 overflow-auto">
          {JSON.stringify({ root: {}, content: [] }, null, 2)}
        </pre>
      </div>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-[#93A37F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-slate-400 text-sm font-medium">Loading store...</p>
    </div>
  </div>
);

// ─── MAIN VIEWER ──────────────────────────────────────────────────────────────

export default function StoreViewer() {
  const params = useParams();
  const marketplaceId: string = (Array.isArray(params?.id) ? params.id[0] : params?.id) ?? '';

  const [craftJson, setCraftJson] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notPublished, setNotPublished] = useState(false);

  useEffect(() => {
    if (!marketplaceId) { setLoading(false); setNotPublished(true); return; }

    supabase
      .from("marketplace")
      .select("config_published, name")
      .eq("id", marketplaceId)
      .single()
      .then(({ data, error }) => {
        setLoading(false);

        if (error) { console.error("Viewer load error:", error); setNotPublished(true); return; }

        const raw = data?.config_published;

        // Check if it's genuinely empty (default {} or missing ROOT)
        if (!raw) { setNotPublished(true); return; }

        try {
          const asString = typeof raw === 'string' ? raw : JSON.stringify(raw);
          const parsed = JSON.parse(asString);

          // If ROOT is empty or missing, it was never published
          if (!parsed.ROOT || Object.keys(parsed.ROOT).length === 0) {
            setNotPublished(true);
            return;
          }

          setCraftJson(asString);
        } catch (e) {
          console.error("Failed to parse config_published:", e);
          setNotPublished(true);
        }
      });
  }, [marketplaceId]);

  if (loading) return <LoadingState />;
  if (notPublished || !craftJson) return <NotPublished />;

  return (
    <div className="w-full min-h-screen">
      <Editor resolver={resolver} enabled={false}>
        <Frame json={craftJson} />
      </Editor>
    </div>
  );
}
