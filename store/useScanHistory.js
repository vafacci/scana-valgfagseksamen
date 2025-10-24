import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCAN_HISTORY_KEY = '@scana_scan_history';

export function useScanHistory() {
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load scan history from AsyncStorage on mount
  useEffect(() => {
    loadScanHistory();
  }, []);

  const loadScanHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
      if (storedHistory) {
        setScanHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading scan history:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveScanHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(newHistory));
      setScanHistory(newHistory);
    } catch (error) {
      console.error('Error saving scan history:', error);
    }
  };

  const addScan = async (scanData, onEloUpdate) => {
    const newScan = {
      id: Date.now().toString(),
      productName: scanData.productName || 'Unknown Product',
      price: scanData.price || 'N/A',
      date: new Date().toLocaleDateString('da-DK'),
      timestamp: new Date().toISOString(),
      photoUri: scanData.photoUri,
    };
    
    const newHistory = [newScan, ...scanHistory].slice(0, 20); // Keep only last 20 scans
    await saveScanHistory(newHistory);
    console.log('Scan added, new history length:', newHistory.length); // Debug log
    
    // Update elo if callback is provided
    if (onEloUpdate) {
      console.log('Updating elo...'); // Debug log
      await onEloUpdate(5); // Increase elo by 5
    }
  };

  const clearHistory = async () => {
    await saveScanHistory([]);
  };

  const removeScan = async (scanId) => {
    const newHistory = scanHistory.filter(scan => scan.id !== scanId);
    await saveScanHistory(newHistory);
  };

  return {
    scanHistory,
    loading,
    addScan,
    clearHistory,
    removeScan,
    loadScanHistory,
  };
}
