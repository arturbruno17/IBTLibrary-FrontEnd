
import { useState, useCallback, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';

interface ScannerOptions {
  onDetected: (result: string) => void;
}

export function useScanner({ onDetected }: ScannerOptions) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize the barcode reader
  useEffect(() => {
    // Create hints to optimize for ISBN barcodes
    const hints = new Map();
    const formats = [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_39,
      BarcodeFormat.CODE_128
    ];
    
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    
    // Create and configure the reader - fixed the type issue by passing options correctly
    const reader = new BrowserMultiFormatReader(hints);
    // Configure timings separately - this is the proper way to set these options
    reader.timeBetweenDecodingAttempts = 100;
    reader.timeBetweenScansMillis = 500;
    
    readerRef.current = reader;
    
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  // Get available cameras
  const getCameras = useCallback(async () => {
    try {
      setError('');
      if (!readerRef.current) return;
      
      const devices = await readerRef.current.listVideoInputDevices();
      setCameras(devices);
      
      if (devices.length > 0 && !selectedCamera) {
        // Select the back camera by default if it exists
        const backCamera = devices.find(device => 
          device.label?.toLowerCase().includes('back') || 
          device.label?.toLowerCase().includes('traseira')
        );
        
        setSelectedCamera(backCamera?.deviceId || devices[0].deviceId);
      }
    } catch (err) {
      console.error('Error accessing cameras:', err);
      setError('Could not access cameras. Please check your permissions.');
    }
  }, [selectedCamera]);

  // Start scanning for barcodes
  const startScanning = useCallback(async () => {
    try {
      setError('');
      if (!readerRef.current || !selectedCamera) {
        if (cameras.length === 0) {
          await getCameras();
        }
        return;
      }
      
      setIsScanning(true);
      
      await readerRef.current.decodeFromVideoDevice(
        selectedCamera,
        'video-preview',
        (result, error) => {
          if (result) {
            const text = result.getText();
            onDetected(text);
          }
          
          if (error && !(error instanceof Error)) {
            // Ignore normal operation errors
          }
        }
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Failed to start the barcode scanner.');
      setIsScanning(false);
    }
  }, [cameras, getCameras, onDetected, selectedCamera]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    if (readerRef.current) {
      readerRef.current.reset();
      setIsScanning(false);
    }
  }, []);

  // Change selected camera
  const changeCamera = useCallback((deviceId: string) => {
    if (isScanning) {
      stopScanning();
    }
    
    setSelectedCamera(deviceId);
    
    // Restart scanning after a short delay
    setTimeout(() => {
      if (deviceId) {
        startScanning();
      }
    }, 500);
  }, [isScanning, startScanning, stopScanning]);

  return {
    isScanning,
    startScanning,
    stopScanning,
    cameras,
    selectedCamera,
    changeCamera,
    getCameras,
    error
  };
}
