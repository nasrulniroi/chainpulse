"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2 } from "lucide-react";

interface ShareButtonProps {
  address: string;
}

export function ShareButton({ address }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/profile/${address}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${address}`;
    if (navigator.share) {
      await navigator.share({
        title: "ChainPulse — Wallet Profile",
        text: "Check out this wallet profile on ChainPulse",
        url,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-1.5 text-emerald-400" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-1.5" />
            Copy Link
          </>
        )}
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-1.5" />
        Share
      </Button>
    </div>
  );
}
