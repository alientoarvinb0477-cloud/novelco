"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase";
import { useParams } from "next/navigation";
import { Editor, Frame, Element } from "@craftjs/core";

// --- INTERNAL FALLBACK COMPONENTS (Prevents "Module Not Found" Error) ---
const Container = ({ children, background, padding = 20, ...props }: any) => {
  return (
    <div {...props} style={{ background, padding: `${padding}px` }}>
      {children}
    </div>
  );
};

const Text = ({ text, fontSize, fontWeight, color, ...props }: any) => {
  return (
    <p {...props} style={{ fontSize: `${fontSize}px`, fontWeight, color }}>
      {text}
    </p>
  );
};
// -----------------------------------------------------------------------

export default function UserPublishedWebpage() {
  const { id } = useParams();
  const [publishedConfig, setPublishedConfig] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState<any>(null);

  useEffect(() => {
    const fetchPublishedSite = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("marketplace")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching published site:", error);
      } else if (data) {
        setStoreData(data);
        if (data.config_published) {
          const config = typeof data.config_published === "string" 
            ? data.config_published 
            : JSON.stringify(data.config_published);
          setPublishedConfig(config);
        }
      }
      setLoading(false);
    };

    fetchPublishedSite();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-sans text-stone-400 uppercase tracking-widest">Loading Store...</div>;

  if (!publishedConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{storeData?.name || "The Store"}</h1>
          <p className="text-stone-500 italic">No custom design has been published yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Editor enabled={false} resolver={{ Container, Text }}>
        <Frame data={publishedConfig}>
          <Element is={Container} canvas />
        </Frame>
      </Editor>
    </div>
  );
}
