import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

/**
 * Web taps must NOT use TouchableOpacity/Pressable (RN global responder lock).
 * They must also NOT go through react-native-web's createElement:
 * that helper ignores children passed as a third argument, and role="button"
 * is rewritten to a native <button>, which collapses flex children to empty
 * boxes on iOS Safari.
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
    const activate = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!disabled && onPress) onPress(event);
    };
    const flat = StyleSheet.flatten([styles.webBase, style, disabled && styles.disabled]) || {};
    return React.createElement(
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
        style: {
          ...flat,
          display: flat.display || 'flex',
          cursor: disabled ? 'default' : 'pointer',
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        },
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
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
    borderWidth: 0,
    margin: 0,
    padding: 0,
  },
  disabled: {
    opacity: 0.5,
  },
});
