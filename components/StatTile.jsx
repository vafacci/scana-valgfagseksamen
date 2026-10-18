import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function StatTile({ icon, value, label, animated = false }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (animated) {
      animatedValue.setValue(0);
      setDisplayValue(0);

      Animated.timing(animatedValue, {
        toValue: parseInt(value) || 0,
        duration: 1500,
        useNativeDriver: false,
      }).start();

      const listener = animatedValue.addListener(({ value: animatedVal }) => {
        setDisplayValue(Math.round(animatedVal));
      });

      return () => {
        animatedValue.removeListener(listener);
      };
    }

    setDisplayValue(parseInt(value) || 0);
  }, [value, animated, animatedValue]);

  return (
    <View style={styles.container}>
      <MaterialIcons name={icon} size={20} color={colors.muted} style={styles.icon} />
      <Text style={styles.value}>{animated ? displayValue : value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  icon: {
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
  },
});
