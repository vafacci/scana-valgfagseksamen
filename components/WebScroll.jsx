import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

export default function WebScroll({
  children,
  style,
  contentContainerStyle,
  keyboardShouldPersistTaps,
  showsVerticalScrollIndicator,
  ...rest
}) {
  if (Platform.OS !== 'web') {
    return (
      <ScrollView
        style={style}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        {...rest}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.web, style]}>
      <View style={contentContainerStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  web: {
    flex: 1,
    overflow: 'auto',
  },
});
