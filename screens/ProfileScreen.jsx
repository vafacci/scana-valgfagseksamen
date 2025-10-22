import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import Avatar from '../components/Avatar';
import StatTile from '../components/StatTile';
import ListItem from '../components/ListItem';
import SettingsScreen from './SettingsScreen';
import { useScanHistory } from '../store/useScanHistory';

export default function ProfileScreen({ navigation }) {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const { scanHistory, loading, loadScanHistory } = useScanHistory();
  console.log('ProfileScreen rendered!'); // Debug log

  // Refresh scan history when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('ProfileScreen focused, loading scan history...');
      loadScanHistory();
    });

    return unsubscribe;
  }, [navigation, loadScanHistory]);

  return (
    <SafeAreaView style={styles.container}>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Avatar and Gear */}
        <View style={styles.header}>
          <Avatar 
            name="Mads Jensen" 
            subtitle="Member since Jan 2025"
            size={60}
          />
          <TouchableOpacity 
            style={styles.gearButton}
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatTile icon="📱" value="14" label="Scans" />
          <StatTile icon="❤️" value="4" label="Favorits" />
          <StatTile icon="🏆" value="230" label="Elo" />
        </View>

        {/* Recent Scans Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : scanHistory.length > 0 ? (
            scanHistory.map((scan) => (
              <ListItem
                key={scan.id}
                thumbnail=""
                title={scan.productName}
                date={scan.date}
                price={scan.price}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No scans yet. Start scanning to see your history here!</Text>
          )}
        </View>
      </ScrollView>
      
      {/* Settings Modal */}
      <SettingsScreen 
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  gearButton: {
    padding: 8,
    marginLeft: 16,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
});
