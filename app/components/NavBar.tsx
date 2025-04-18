import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Dimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function NavBar() {
  const notificationCount = 3;
  return (
    <View style={styles.navbar}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="cover"
      />

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconWrapper}>
          <Feather name="bell" size={22} color="#1E1E1E" />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileContainer}>
          <Feather name="user" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ddd',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 10 : 50,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 100,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#5A67D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
