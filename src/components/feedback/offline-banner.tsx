import { StyleSheet, Text, View } from 'react-native';

type OfflineBannerProps = {
  isOnline: boolean;
};

export function OfflineBanner({ isOnline }: OfflineBannerProps) {
  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        You are offline. Some actions are temporarily disabled.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fef3c7',
    borderBottomWidth: 1,
    borderBottomColor: '#fcd34d',
  },
  text: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#92400e',
  },
});
