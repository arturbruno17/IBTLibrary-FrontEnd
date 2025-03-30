import { useState, useCallback, useEffect, useRef } from "react";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";

interface ScannerOptions {
  onDetected: (result: string) => void;
}

export function useScanner({ onDetected }: ScannerOptions) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [error, setError] = useState<string>("");

  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize the barcode reader
  useEffect(() => {
    const hints = new Map();
    const formats = [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_39,
      BarcodeFormat.CODE_128,
    ];

    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new BrowserMultiFormatReader(hints, 500);
    readerRef.current = reader;

    return () => {
      stopScanning();
      reader.reset();
    };
  }, []);

  const stopScanning = useCallback(() => {
    console.log("Stopping scanner");

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    readerRef.current?.reset();
    setIsScanning(false);
  }, []);

  const getCameras = useCallback(async () => {
    try {
      setError("");

      // Solicita permissão antes de listar dispositivos
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.error("Camera permission error:", err);
        setError("Permissão da câmera negada. Verifique as configurações do navegador.");
        return;
      }

      if (!readerRef.current) return;

      const devices = await readerRef.current.listVideoInputDevices();
      console.log("Available cameras:", devices);
      setCameras(devices);

      if (devices.length > 0 && !selectedCamera) {
        const backCamera = devices.find(
          (device) =>
            device.label?.toLowerCase().includes("back") ||
            device.label?.toLowerCase().includes("traseira") ||
            device.label?.toLowerCase().includes("rear")
        );

        const cameraToUse = backCamera?.deviceId || devices[0].deviceId;
        console.log("Auto-selecting camera:", cameraToUse);
        setSelectedCamera(cameraToUse);
      }
    } catch (err) {
      console.error("Error accessing cameras:", err);
      setError("Erro ao acessar a câmera. Verifique as permissões.");
    }
  }, [selectedCamera]);

  const startScanning = useCallback(async () => {
    try {
      setError("");
      console.log("Starting scan, selected camera:", selectedCamera);

      if (!readerRef.current) {
        console.error("Reader not initialized");
        return;
      }

      if (!selectedCamera) {
        if (cameras.length === 0) {
          await getCameras();
        }
        return;
      }

      if (isScanning) {
        stopScanning();
      }

      const videoElement = videoRef.current;
      if (!videoElement) {
        console.error("Video element not available");
        return;
      }

      readerRef.current.reset();
      setIsScanning(true);

      await readerRef.current.decodeFromVideoDevice(
        selectedCamera,
        videoElement,
        (result, err) => {
          if (result) {
            const text = result.getText();
            console.log("Code detected:", text);
            onDetected(text);
          }
        }
      );

      if (videoElement.srcObject instanceof MediaStream) {
        streamRef.current = videoElement.srcObject;
      }

    } catch (err) {
      console.error("Error starting scanner:", err);
      setError("Erro ao iniciar o scanner.");
      setIsScanning(false);
    }
  }, [cameras, getCameras, onDetected, selectedCamera, isScanning, stopScanning]);

  const changeCamera = useCallback(
    (deviceId: string) => {
      console.log("Changing camera to:", deviceId);
      if (isScanning) {
        stopScanning();
      }

      setSelectedCamera(deviceId);

      setTimeout(() => {
        if (deviceId) {
          startScanning();
        }
      }, 500);
    },
    [isScanning, startScanning, stopScanning]
  );

  return {
    isScanning,
    startScanning,
    stopScanning,
    cameras,
    selectedCamera,
    changeCamera,
    getCameras,
    error,
    videoRef,
  };
}
