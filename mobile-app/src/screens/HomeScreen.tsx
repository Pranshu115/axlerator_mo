import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ApiService, { Truck } from '../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [featuredTrucks, setFeaturedTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedTrucks();
  }, []);

  const loadFeaturedTrucks = async () => {
    try {
      setLoading(true);
      const trucks = await ApiService.getTrucks(6);
      setFeaturedTrucks(trucks);
    } catch (error) {
      console.error('Error loading trucks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTruckPress = (truck: Truck) => {
    navigation.navigate('TruckDetail' as never, { truck } as never);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Find Your Perfect Truck</Text>
        <Text style={styles.heroSubtitle}>
          India's Premier Truck Marketplace
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Browse' as never)}
        >
          <Text style={styles.ctaButtonText}>Browse Trucks</Text>
        </TouchableOpacity>
      </View>

      {/* Trust Bar */}
      <View style={styles.trustBar}>
        <View style={styles.trustItem}>
          <Ionicons name="shield-checkmark" size={24} color="#2563eb" />
          <Text style={styles.trustText}>Certified Trucks</Text>
        </View>
        <View style={styles.trustItem}>
          <Ionicons name="time" size={24} color="#2563eb" />
          <Text style={styles.trustText}>24h Response</Text>
        </View>
        <View style={styles.trustItem}>
          <Ionicons name="location" size={24} color="#2563eb" />
          <Text style={styles.trustText}>Pan-India</Text>
        </View>
      </View>

      {/* Featured Trucks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Certified Trucks</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Browse' as never)}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.trucksScroll}
            contentContainerStyle={styles.trucksContainer}
          >
            {featuredTrucks.map((truck) => (
              <TouchableOpacity
                key={truck.id}
                style={styles.truckCard}
                onPress={() => handleTruckPress(truck)}
              >
                <Image
                  source={{ uri: truck.image || '/default-truck.png' }}
                  style={styles.truckImage}
                  resizeMode="cover"
                />
                {truck.certified && (
                  <View style={styles.certifiedBadge}>
                    <Ionicons name="shield-checkmark" size={16} color="#fff" />
                    <Text style={styles.certifiedText}>Certified</Text>
                  </View>
                )}
                <View style={styles.truckInfo}>
                  <Text style={styles.truckName} numberOfLines={1}>
                    {truck.name}
                  </Text>
                  <Text style={styles.truckPrice}>{truck.price}</Text>
                  <View style={styles.truckDetails}>
                    <Text style={styles.truckDetail}>{truck.mileage}</Text>
                    <Text style={styles.truckDetail}>•</Text>
                    <Text style={styles.truckDetail}>{truck.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Sell' as never)}
          >
            <Ionicons name="add-circle" size={32} color="#2563eb" />
            <Text style={styles.actionText}>Sell Your Truck</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Services' as never)}
          >
            <Ionicons name="business" size={32} color="#2563eb" />
            <Text style={styles.actionText}>Our Services</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>About Axlerator</Text>
        <Text style={styles.aboutText}>
          India's most trusted platform for pre-owned commercial vehicles.
          We provide transparency, fair pricing, and end-to-end support.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  heroSection: {
    backgroundColor: '#2563eb',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  trustBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  trustItem: {
    alignItems: 'center',
  },
  trustText: {
    marginTop: 8,
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  trucksScroll: {
    marginHorizontal: -16,
  },
  trucksContainer: {
    paddingHorizontal: 16,
  },
  truckCard: {
    width: width * 0.75,
    marginRight: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  truckImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#e5e7eb',
  },
  certifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  certifiedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  truckInfo: {
    padding: 12,
  },
  truckName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  truckPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  truckDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  truckDetail: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 8,
  },
  loader: {
    paddingVertical: 40,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  actionText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  aboutSection: {
    padding: 24,
    backgroundColor: '#f9fafb',
    marginTop: 24,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
  },
});
