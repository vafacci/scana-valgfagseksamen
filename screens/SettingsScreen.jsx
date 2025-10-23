import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { colors } from '../theme/colors';
import { useAuth } from '../store/useAuth';
import GradientButton from '../components/GradientButton';

export default function SettingsScreen({ navigation, visible, onClose }) {
  // Determine if this is being used as a modal or regular screen
  const isModal = visible !== undefined;
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    if (isModal && onClose) {
      onClose();
    }
  };

  const handleAddUser = () => {
    console.log('Add new user pressed');
    // TODO: Navigate to add user screen
  };

  const handleDeleteAccount = () => {
    console.log('Delete account pressed');
    // TODO: Implement delete account functionality
  };

  const renderModalContent = () => (
    <View style={styles.modalContent}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onClose}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
          <Text style={styles.backText}>Tilbage</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Indstillinger</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log ud</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleAddUser}>
          <Text style={styles.buttonText}>Tilføj ny bruger</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleDeleteAccount}>
          <Text style={[styles.buttonText, styles.deleteText]}>Slet konto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderScreenContent = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Large Heading */}
      <View style={styles.header}>
        <Text style={styles.title}>Indstillinger</Text>
      </View>

      {/* Five Gradient Buttons */}
      <View style={styles.buttonsContainer}>
        <GradientButton 
          title="Profilindstillinger" 
          onPress={() => console.log('Profile settings pressed')}
        />
        <GradientButton 
          title="Notifikationer" 
          onPress={() => console.log('Notifications pressed')}
        />
        <GradientButton 
          title="Sprog og tema" 
          onPress={() => console.log('Language and theme pressed')}
        />
        <GradientButton 
          title="Privatliv og sikkerhed" 
          onPress={() => console.log('Privacy and security pressed')}
        />
        <GradientButton 
          title="Konto" 
          onPress={() => console.log('Account pressed')}
        />
      </View>

      {/* Text Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={handleAddUser}>
          <Text style={styles.linkText}>Tilføj en ny bruger</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.linkText}>Log ud</Text>
        </TouchableOpacity>
      </View>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        <QRCode
          value="scana://user/mads-jensen"
          size={200}
          color={colors.text}
          backgroundColor="transparent"
        />
      </View>

      {/* Footer Text */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Sammenlign priser fra flere butikker - direkte efter du scanner varen.
        </Text>
      </View>
    </ScrollView>
  );

  if (isModal) {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          {renderModalContent()}
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderScreenContent()}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: '60%',
  },
  screenContent: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: colors.text,
    fontSize: 16,
    marginLeft: 8,
  },
  titleContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteText: {
    color: '#FF4444', // Red color for delete action
  },
  scrollView: {
    flex: 1,
    paddingTop: 30,
  },
  linksContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  linkText: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 12,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
});
