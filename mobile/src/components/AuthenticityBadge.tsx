import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, fontSize, spacing } from '../theme';

interface AuthenticityBadgeProps {
  score: number;
  size?: 'sm' | 'md';
}

export function AuthenticityBadge({ score, size = 'md' }: AuthenticityBadgeProps) {
  const getColor = () => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  const getLabel = () => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  };

  const color = getColor();
  const isSm = size === 'sm';

  return (
    <View style={[styles.container, { borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.score, isSm && styles.scoreSm, { color }]}>
        {score.toFixed(0)}
      </Text>
      {!isSm && <Text style={[styles.label, { color }]}>{getLabel()}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 1,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  score: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  scoreSm: {
    fontSize: fontSize.xs,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
});
