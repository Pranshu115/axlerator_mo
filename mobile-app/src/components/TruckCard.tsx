import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Truck } from '../services/api';

const { width } = Dimensions.get('window');

interface TruckCardProps {
  truck: Truck;
  onPress: () => void;
}

export default function TruckCard({ truck, onPress }: TruckCardProps) {
  const priceNumber = parseInt(truck.price.replace(/[^0-9]/g, ''), 10) || 0;
  const emiValue = priceNumber > 0 ? Math.round(priceNumber / 60) : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: truck.image || '/default-truck.png' }}
          style={styles.image}
          resizeMode="cover"
        />
        {truck.certified && (
          <View style={styles.certifiedBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#fff" />
            <Text style={styles.certifiedText}>Certified</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {truck.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{truck.price}</Text>
          {emiValue && (
            <Text style={styles.emi}>EMI: ₹{emiValue.toLocaleString('en-IN')}/mo</Text>
          )}
        </View>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={14} color="#6b7280" />
            <Text style={styles.detailText}>{truck.mileage}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="car-outline" size={14} color="#6b7280" />
            <Text style={styles.detailText}>{truck.engine}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={14} color="#6b7280" />
            <Text style={styles.detailText} numberOfLines={1}>
              {truck.location}
            </Text>
          </View>
        </View>
        {truck.owner && (
          <Text style={styles.ownerText}>{truck.owner}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
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
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  emi: {
    fontSize: 12,
    color: '#6b7280',
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
    maxWidth: 100,
  },
  ownerText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});
