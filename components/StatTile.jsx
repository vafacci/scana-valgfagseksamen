import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';

export default function StatTile({ icon, value, label, animated = false }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (animated) {
      // Reset animation value
      animatedValue.setValue(0);
      setDisplayValue(0);
      
      // Animate to target value
      Animated.timing(animatedValue, {
        toValue: parseInt(value) || 0,
        duration: 1500,
        useNativeDriver: false,
      }).start();

      // Update display value during animation
      const listener = animatedValue.addListener(({ value: animatedVal }) => {
        setDisplayValue(Math.round(animatedVal));
      });

      return () => {
        animatedValue.removeListener(listener);
      };
    } else {
      // If not animated, set the value directly
      setDisplayValue(parseInt(value) || 0);
    }
  }, [value, animated, animatedValue]);

  const renderValue = () => {
    if (animated) {
      return (
        <Text style={styles.value}>
          {displayValue}
        </Text>
      );
    }
    return <Text style={styles.value}>{value}</Text>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      {renderValue()}
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    fontSize: 20,
    color: colors.text,
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
