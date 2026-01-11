import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ApiService, { Truck } from '../services/api';
import TruckCard from '../components/TruckCard';
import FilterModal from '../components/FilterModal';

const { width } = Dimensions.get('window');

export default function BrowseTrucksScreen() {
  const navigation = useNavigation();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [filteredTrucks, setFilteredTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    priceMin: 50000,
    priceMax: 7000000,
    selectedBrands: [] as string[],
    selectedYear: '',
    selectedKmDriven: '',
    selectedFuelTypes: [] as string[],
  });

  useEffect(() => {
    loadTrucks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, trucks, searchQuery, sortBy]);

  const loadTrucks = async () => {
    try {
      setLoading(true);
      const certifiedTrucks = await ApiService.getTrucks(100);
      const submissions = await ApiService.getTruckSubmissions('approved');
      
      // Transform and combine trucks
      const allTrucks = [
        ...certifiedTrucks.map(formatTruck),
        ...submissions.map(formatSubmission),
      ];
      
      setTrucks(allTrucks);
      setFilteredTrucks(allTrucks);
    } catch (error) {
      console.error('Error loading trucks:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTruck = (truck: Truck): Truck => {
    return {
      ...truck,
      price: `₹${parseFloat(truck.price.toString()).toLocaleString('en-IN')}`,
      mileage: `${truck.mileage || '0'} km`,
    };
  };

  const formatSubmission = (sub: any): Truck => {
    return {
      id: sub.id + 10000,
      name: `${sub.year} ${sub.manufacturer} ${sub.model}`,
      year: sub.year,
      price: `₹${parseFloat(sub.askingPrice.toString()).toLocaleString('en-IN')}`,
      mileage: `${sub.kilometers?.toLocaleString() || '0'} km`,
      engine: sub.fuelType || 'Diesel',
      transmission: sub.transmission || 'Manual',
      location: `${sub.city || 'Unknown'}, ${sub.state || 'Unknown'}`,
      image: sub.images ? JSON.parse(sub.images)[0] : '/default-truck.png',
      certified: sub.certified ?? false,
      manufacturer: sub.manufacturer,
      model: sub.model,
    };
  };

  const applyFilters = useCallback(() => {
    let filtered = [...trucks];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(truck => {
        const name = truck.name.toLowerCase();
        const manufacturer = (truck.manufacturer || '').toLowerCase();
        const model = (truck.model || '').toLowerCase();
        return name.includes(query) || manufacturer.includes(query) || model.includes(query);
      });
    }

    // Price filter
    filtered = filtered.filter(truck => {
      const priceText = truck.price.replace(/[^0-9]/g, '');
      const price = parseInt(priceText) || 0;
      return price >= filters.priceMin && price <= filters.priceMax;
    });

    // Brand filter
    if (filters.selectedBrands.length > 0) {
      filtered = filtered.filter(truck =>
        filters.selectedBrands.some(brand =>
          truck.name.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    // Year filter
    if (filters.selectedYear) {
      const [minYear, maxYear] = parseYearRange(filters.selectedYear);
      filtered = filtered.filter(truck => truck.year >= minYear && truck.year <= maxYear);
    }

    // KM filter
    if (filters.selectedKmDriven) {
      const [minKm, maxKm] = parseKmRange(filters.selectedKmDriven);
      filtered = filtered.filter(truck => {
        const km = parseInt(truck.mileage.replace(/[^0-9]/g, '')) || 0;
        return km >= minKm && km <= maxKm;
      });
    }

    // Fuel type filter
    if (filters.selectedFuelTypes.length > 0) {
      filtered = filtered.filter(truck =>
        filters.selectedFuelTypes.includes(truck.engine)
      );
    }

    // Sort
    const sorted = sortTrucks(filtered, sortBy);
    setFilteredTrucks(sorted);
  }, [filters, trucks, searchQuery, sortBy]);

  const parseYearRange = (range: string): [number, number] => {
    if (range === 'Before 2009') return [0, 2008];
    const match = range.match(/(\d{4})\s*-\s*(\d{4})/);
    if (match) return [parseInt(match[1]), parseInt(match[2])];
    return [0, new Date().getFullYear()];
  };

  const parseKmRange = (range: string): [number, number] => {
    if (range === 'Less than 10,000 km') return [0, 9999];
    if (range === 'More than 2,00,000 km') return [200000, Infinity];
    const match = range.match(/(\d{1,3}(?:,\d{2,3})*)\s*-\s*(\d{1,3}(?:,\d{2,3})*)/);
    if (match) {
      return [
        parseInt(match[1].replace(/,/g, '')),
        parseInt(match[2].replace(/,/g, '')),
      ];
    }
    return [0, Infinity];
  };

  const sortTrucks = (trucks: Truck[], sort: string): Truck[] => {
    const sorted = [...trucks];
    switch (sort) {
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
          const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
          return priceA - priceB;
        });
      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
          const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
          return priceB - priceA;
        });
      case 'year-new':
        return sorted.sort((a, b) => b.year - a.year);
      case 'year-old':
        return sorted.sort((a, b) => a.year - b.year);
      default:
        return sorted;
    }
  };

  const handleTruckPress = (truck: Truck) => {
    navigation.navigate('TruckDetail' as never, { truck } as never);
  };

  const renderTruck = ({ item }: { item: Truck }) => (
    <TruckCard truck={item} onPress={() => handleTruckPress(item)} />
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search trucks by brand, model..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.resultsText}>
          {filteredTrucks.length} trucks found
        </Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'newest' && styles.sortButtonActive]}
            onPress={() => setSortBy('newest')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'newest' && styles.sortButtonTextActive]}>
              Newest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'price-low' && styles.sortButtonActive]}
            onPress={() => setSortBy('price-low')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'price-low' && styles.sortButtonTextActive]}>
              Price: Low
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'price-high' && styles.sortButtonActive]}
            onPress={() => setSortBy('price-high')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'price-high' && styles.sortButtonTextActive]}>
              Price: High
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Trucks List */}
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredTrucks}
          renderItem={renderTruck}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>No trucks found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          }
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        filters={filters}
        onClose={() => setShowFilters(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setShowFilters(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    padding: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
    backgroundColor: '#f3f4f6',
  },
  sortButtonActive: {
    backgroundColor: '#2563eb',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
});
