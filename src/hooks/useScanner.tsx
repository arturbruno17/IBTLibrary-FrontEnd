
import { useState, useEffect, useCallback } from 'react';
import { BrowserMultiFormatReader, Result, BarcodeFormat } from '@zxing/library';

interface UseScannerProps {
  onDetected: (result: string) => void;
  cameraId?: string;
}

export function useScanner({ onDetected, cameraId }: UseScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | undefined>(cameraId);
  const [error, setError] = useState<string | null>(null);

  // Initialize scanner
  const reader = new BrowserMultiFormatReader(undefined, {
    delayBetweenScanAttempts: 100,
    delayBetweenScanSuccess: 500,
  });

  // Get available cameras
  const getCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameras(videoDevices);
      
      // If no camera is selected and we have cameras, select the first one
      if (!selectedCamera && videoDevices.length > 0) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error getting cameras:', err);
      setError('Failed to access cameras. Please check permissions.');
    }
  }, [selectedCamera]);

  // Start scanning
  const startScanning = useCallback(async () => {
    if (!selectedCamera) {
      setError('No camera selected');
      return;
    }

    try {
      setIsScanning(true);
      setError(null);
      
      // Configure hints to only detect EAN and ISBN formats for better performance
      const formats = [
        BarcodeFormat.EAN_8,
        BarcodeFormat.EAN_13,
        BarcodeFormat.ISBN
      ];
      
      reader.setHints(formats);
      
      await reader.decodeFromVideoDevice(
        selectedCamera,
        'video-preview',
        (result: Result | null) => {
          if (result) {
            const text = result.getText();
            onDetected(text);
          }
        }
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Failed to start scanner. Please check camera permissions.');
      setIsScanning(false);
    }
  }, [selectedCamera, onDetected, reader]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    if (isScanning) {
      reader.reset();
      setIsScanning(false);
    }
  }, [isScanning, reader]);

  // Change camera
  const changeCamera = useCallback((deviceId: string) => {
    stopScanning();
    setSelectedCamera(deviceId);
  }, [stopScanning]);

  // Load cameras on mount
  useEffect(() => {
    getCameras();
    
    // Cleanup on unmount
    return () => {
      stopScanning();
    };
  }, [getCameras, stopScanning]);

  return {
    isScanning,
    startScanning,
    stopScanning,
    cameras,
    selectedCamera,
    changeCamera,
    error,
  };
}

export default useScanner;
