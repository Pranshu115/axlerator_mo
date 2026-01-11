import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Truck } from '../services/api';

const { width } = Dimensions.get('window');

export default function TruckDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { truck } = route.params as { truck: Truck };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = truck.images && truck.images.length > 0 
    ? truck.images 
    : truck.image 
      ? [truck.image] 
      : [];

  const handleCall = () => {
    Linking.openURL('tel:+911234567890');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/911234567890');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Carousel */}
      <View style={styles.imageContainer}>
        {images.length > 0 && (
          <Image
            source={{ uri: images[currentImageIndex] }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        {images.length > 1 && (
          <View style={styles.imageIndicators}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.indicatorActive,
                ]}
              />
            ))}
          </View>
        )}
        {truck.certified && (
          <View style={styles.certifiedBadge}>
            <Ionicons name="shield-checkmark" size={20} color="#fff" />
            <Text style={styles.certifiedText}>Certified</Text>
          </View>
        )}
      </View>

      {/* Truck Info */}
      <View style={styles.content}>
        <Text style={styles.name}>{truck.name}</Text>
        <Text style={styles.price}>{truck.price}</Text>

        {/* Key Details */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={20} color="#6b7280" />
            <Text style={styles.detailLabel}>Year</Text>
            <Text style={styles.detailValue}>{truck.year}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={20} color="#6b7280" />
            <Text style={styles.detailLabel}>Mileage</Text>
            <Text style={styles.detailValue}>{truck.mileage}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="car-outline" size={20} color="#6b7280" />
            <Text style={styles.detailLabel}>Fuel</Text>
            <Text style={styles.detailValue}>{truck.engine}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="settings-outline" size={20} color="#6b7280" />
            <Text style={styles.detailLabel}>Transmission</Text>
            <Text style={styles.detailValue}>{truck.transmission}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationSection}>
          <Ionicons name="location" size={20} color="#2563eb" />
          <Text style={styles.locationText}>{truck.location}</Text>
        </View>

        {/* Owner Info */}
        {truck.owner && (
          <View style={styles.ownerSection}>
            <Text style={styles.ownerText}>{truck.owner}</Text>
          </View>
        )}

        {/* Features */}
        {truck.features && truck.features.length > 0 && (
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              {truck.features.map((feature, index) => (
                <View key={index} style={styles.featureTag}>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contact Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color="#ffffff" />
            <Text style={styles.callButtonText}>Call Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={20} color="#ffffff" />
            <Text style={styles.whatsappButtonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#ffffff',
    width: 24,
  },
  certifiedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  certifiedText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  detailItem: {
    width: '50%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  ownerSection: {
    marginBottom: 24,
  },
  ownerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
  },
  actionsSection: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 32,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  callButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25d366',
    padding: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  whatsappButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
