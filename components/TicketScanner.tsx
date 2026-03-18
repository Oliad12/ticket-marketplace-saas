"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CheckCircle, XCircle, Camera, CameraOff } from "lucide-react";

type ScanResult = {
  success: boolean;
  message: string;
  holderName?: string;
  holderEmail?: string;
};

export default function TicketScanner({
  eventId,
  sellerId,
}: {
  eventId: Id<"events">;
  sellerId: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  const validateTicket = useMutation(api.tickets.validateTicket);

  const startScanner = async () => {
    if (!videoRef.current) return;
    setResult(null);
    setScanning(true);
    const reader = new BrowserQRCodeReader();
    try {
      controlsRef.current = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        async (scanResult, err) => {
          if (!scanResult || processing) return;
          const text = scanResult.getText();
          // Debounce — don't re-scan same ticket within 3s
          if (text === lastScanned) return;
          setLastScanned(text);
          setTimeout(() => setLastScanned(null), 3000);

          setProcessing(true);
          try {
            const res = await validateTicket({
              ticketId: text as Id<"tickets">,
              eventId,
              sellerId,
            });
            setResult(res);
          } catch {
            setResult({ success: false, message: "Invalid ticket ID" });
          } finally {
            setProcessing(false);
          }
        }
      );
    } catch {
      setResult({ success: false, message: "Could not access camera" });
      setScanning(false);
    }
  };

  const stopScanner = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setScanning(false);
  };

  useEffect(() => () => controlsRef.current?.stop(), []);

  return (
    <div className="space-y-4">
      {/* Camera feed */}
      <div className="relative bg-black rounded-xl overflow-hidden aspect-video max-w-md mx-auto">
        <video ref={videoRef} className="w-full h-full object-cover" />
        {!scanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <CameraOff className="w-12 h-12 text-gray-500" />
          </div>
        )}
        {scanning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-2 border-white rounded-lg opacity-60" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        {!scanning ? (
          <button
            onClick={startScanner}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Camera className="w-5 h-5" />
            Start Scanner
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <CameraOff className="w-5 h-5" />
            Stop Scanner
          </button>
        )}
      </div>

      {/* Result */}
      {processing && (
        <div className="text-center text-gray-500 text-sm">Validating...</div>
      )}
      {result && (
        <div
          className={`rounded-xl p-5 border ${
            result.success
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {result.success ? (
              <CheckCircle className="w-7 h-7 text-green-600 shrink-0" />
            ) : (
              <XCircle className="w-7 h-7 text-red-600 shrink-0" />
            )}
            <div>
              <p
                className={`font-semibold ${result.success ? "text-green-800" : "text-red-800"}`}
              >
                {result.message}
              </p>
              {result.success && result.holderName && (
                <p className="text-sm text-green-700 mt-1">
                  {result.holderName} · {result.holderEmail}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
