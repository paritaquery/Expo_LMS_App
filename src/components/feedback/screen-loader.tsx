import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type ScreenLoaderProps = {
  message?: string;
};

export function ScreenLoader({ message = 'Loading...' }: ScreenLoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#0f172a" size="small" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  message: {
    fontSize: 14,
    color: '#334155',
  },
});
