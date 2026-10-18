import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

/**
 * Web taps must NOT use TouchableOpacity/Pressable (RN global responder lock).
 * Use a div[role=button] — NOT <button>. Native <button> breaks RN-web flex
 * children (offer cards / filter labels collapse to empty boxes on iOS Safari).
 */
export default function Tap({
  onPress,
  style,
  children,
  disabled,
  accessibilityLabel,
  accessibilityState,
  accessibilityRole = 'button',
}) {
  if (Platform.OS === 'web') {
    const { unstable_createElement: createElement } = require('react-native-web');
    const activate = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!disabled && onPress) onPress(event);
    };
    return createElement(
      'div',
      {
        role: accessibilityRole || 'button',
        tabIndex: disabled ? -1 : 0,
        'aria-label': accessibilityLabel,
        'aria-disabled': disabled ? true : undefined,
        'aria-pressed': accessibilityState?.selected ? true : undefined,
        onClick: activate,
        onKeyDown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') activate(event);
        },
        onStartShouldSetResponder: () => false,
        onMoveShouldSetResponder: () => false,
        style: [styles.webBase, style, disabled && styles.disabled],
      },
      children
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={style}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      accessibilityRole={accessibilityRole}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  webBase: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    margin: 0,
    padding: 0,
    cursor: 'pointer',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
  },
  disabled: {
    opacity: 0.5,
  },
});
