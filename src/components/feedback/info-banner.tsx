import { StyleSheet, Text, View } from 'react-native';

type InfoBannerTone = 'info' | 'success' | 'warning';

type InfoBannerProps = {
  title: string;
  description: string;
  tone?: InfoBannerTone;
};

const toneStyles: Record<
  InfoBannerTone,
  {
    backgroundColor: string;
    borderColor: string;
    titleColor: string;
    textColor: string;
  }
> = {
  info: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    titleColor: '#1d4ed8',
    textColor: '#1e3a8a',
  },
  success: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    titleColor: '#047857',
    textColor: '#065f46',
  },
  warning: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
    titleColor: '#b45309',
    textColor: '#92400e',
  },
};

export function InfoBanner({ title, description, tone = 'info' }: InfoBannerProps) {
  const colors = toneStyles[tone];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.titleColor }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textColor }]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});
