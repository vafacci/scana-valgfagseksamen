import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import Avatar from '../components/Avatar';
import StatTile from '../components/StatTile';
import ListItem from '../components/ListItem';
import SettingsScreen from './SettingsScreen';

export default function ProfileScreen({ navigation }) {
  const [settingsVisible, setSettingsVisible] = useState(false);
  console.log('ProfileScreen rendered!'); // Debug log
  
  // Mock data for recent scans
  const recentScans = [
    { id: 1, title: 'Iphone 6', date: '01/01/1996', price: 'DKK 10 mil' },
    { id: 2, title: 'Iphone 6', date: '01/01/1996', price: 'DKK 10 mil' },
    { id: 3, title: 'Iphone 6', date: '01/01/1996', price: 'DKK 10 mil' },
    { id: 4, title: 'Iphone 6', date: '01/01/1996', price: 'DKK 10 mil' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.topLabel}>profile</Text>
      </View>
      
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
          {recentScans.map((scan) => (
            <ListItem
              key={scan.id}
              thumbnail=""
              title={scan.title}
              date={scan.date}
              price={scan.price}
            />
          ))}
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
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  gearButton: {
    marginLeft: 'auto',
    padding: 8,
    marginRight: 8, // Add proper margin to keep icon fully visible
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
});
