"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase";
import { useParams } from "next/navigation";
import { Editor, Frame, Element } from "@craftjs/core";

// --- IMPORTANT: IMPORT YOUR DESIGN COMPONENTS ---
// Ensure these match the components used in your builder
import { Container } from "@/components/editor/Container"; 
import { Text } from "@/components/editor/Text";
// --------------------------------------------------

export default function UserPublishedWebpage() {
  const { id } = useParams();
  const [publishedConfig, setPublishedConfig] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState<any>(null);

  useEffect(() => {
    const fetchPublishedSite = async () => {
      if (!id) return;
      
      // Fetch store details and the published configuration from Supabase
      const { data, error } = await supabase
        .from("marketplace")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching published site:", error);
      } else if (data) {
        setStoreData(data);
        
        // Craft.js requires the JSON configuration as a string
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 animate-pulse">
          Loading Store Experience...
        </div>
      </div>
    );
  }

  // Fallback if no configuration is found
  if (!publishedConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to {storeData?.name || "the Store"}</h1>
          <p className="text-stone-500 italic">This owner hasn't published their design yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* enabled={false} renders the JSON but disables editing tools */}
      <Editor
        enabled={false}
        resolver={{
          Container,
          Text,
        }}
      >
        <Frame data={publishedConfig}>
          {/* The root element where user content (like NOVELCO OS) is injected */}
          <Element is={Container} canvas>
            {/* Saved nodes render here */}
          </Element>
        </Frame>
      </Editor>

      <footer className="py-10 text-center border-t border-stone-100 bg-stone-50">
        <p className="font-sans text-[9px] font-bold uppercase tracking-widest text-stone-400">
          Powered by NovelArchStudio • {storeData?.business}
        </p>
      </footer>
    </div>
  );
}
