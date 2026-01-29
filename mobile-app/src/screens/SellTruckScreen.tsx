import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import ApiService, { TruckSubmission } from '../services/api';

export default function SellTruckScreen() {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    kilometers: '',
    transmission: '',
    fuelType: '',
    ownerCount: '',
    rtoState: '',
    nationalPermit: '',
    loanStatus: '',
    insuranceStatus: '',
    rcStatus: '',
    sellTimeline: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    userState: '',
    description: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 8 - images.length,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...newImages].slice(0, 8));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const imageUri of images) {
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'truck-photo.jpg',
        } as any);

        const response = await ApiService.uploadImage(formData);
        uploadedUrls.push(response.url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async () => {
    // Validation
    const requiredFields = [
      'brand',
      'model',
      'year',
      'kilometers',
      'transmission',
      'fuelType',
      'ownerCount',
      'rtoState',
      'nationalPermit',
      'loanStatus',
      'insuranceStatus',
      'rcStatus',
      'sellTimeline',
      'ownerName',
      'ownerPhone',
      'userState',
    ];

    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    if (formData.ownerPhone.length !== 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setSubmitting(true);

      // Upload images if any
      let imageUrls: string[] = [];
      if (images.length > 0) {
        setUploading(true);
        imageUrls = await uploadImages();
        setUploading(false);
      }

      // Prepare submission data
      const submission: TruckSubmission = {
        sellerName: formData.ownerName,
        sellerEmail: formData.ownerEmail || 'lead@no-email.invalid',
        sellerPhone: formData.ownerPhone,
        manufacturer: formData.brand,
        model: formData.model,
        year: parseInt(formData.year) || new Date().getFullYear(),
        registrationNumber: formData.rtoState || null,
        kilometers: parseInt(formData.kilometers.replace(/,/g, '')) || 0,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        ownerNumber: parseInt(formData.ownerCount) || 1,
        askingPrice: 0,
        negotiable: true,
        location: formData.rtoState || formData.userState,
        state: formData.userState,
        city: formData.rtoState.split(' (')[0] || 'Unknown',
        description: formData.description || null,
        images: JSON.stringify(imageUrls),
      };

      await ApiService.submitTruck(submission);

      Alert.alert(
        'Success',
        'Your truck details have been submitted. Our team will reach out within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                brand: '',
                model: '',
                year: '',
                kilometers: '',
                transmission: '',
                fuelType: '',
                ownerCount: '',
                rtoState: '',
                nationalPermit: '',
                loanStatus: '',
                insuranceStatus: '',
                rcStatus: '',
                sellTimeline: '',
                ownerName: '',
                ownerPhone: '',
                ownerEmail: '',
                userState: '',
                description: '',
              });
              setImages([]);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Sell Your Truck</Text>
        <Text style={styles.subtitle}>
          Share complete vehicle details and photos
        </Text>
      </View>

      {/* Vehicle Basics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Basics</Text>
        <TextInput
          style={styles.input}
          placeholder="Brand *"
          value={formData.brand}
          onChangeText={(text) => handleInputChange('brand', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Model *"
          value={formData.model}
          onChangeText={(text) => handleInputChange('model', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Year *"
          value={formData.year}
          onChangeText={(text) => handleInputChange('year', text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Kilometers Driven *"
          value={formData.kilometers}
          onChangeText={(text) => handleInputChange('kilometers', text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Transmission (Manual/Automatic/AMT) *"
          value={formData.transmission}
          onChangeText={(text) => handleInputChange('transmission', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Fuel Type (Diesel/Petrol/CNG/Electric) *"
          value={formData.fuelType}
          onChangeText={(text) => handleInputChange('fuelType', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Owner Count (1st/2nd/3rd) *"
          value={formData.ownerCount}
          onChangeText={(text) => handleInputChange('ownerCount', text)}
        />
      </View>

      {/* Registration & Compliance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registration & Compliance</Text>
        <TextInput
          style={styles.input}
          placeholder="RTO Location *"
          value={formData.rtoState}
          onChangeText={(text) => handleInputChange('rtoState', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="National Permit *"
          value={formData.nationalPermit}
          onChangeText={(text) => handleInputChange('nationalPermit', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Loan Status *"
          value={formData.loanStatus}
          onChangeText={(text) => handleInputChange('loanStatus', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Insurance Status *"
          value={formData.insuranceStatus}
          onChangeText={(text) => handleInputChange('insuranceStatus', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="RC Status *"
          value={formData.rcStatus}
          onChangeText={(text) => handleInputChange('rcStatus', text)}
        />
      </View>

      {/* Contact Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Contact Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          value={formData.ownerName}
          onChangeText={(text) => handleInputChange('ownerName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number (10 digits) *"
          value={formData.ownerPhone}
          onChangeText={(text) => handleInputChange('ownerPhone', text.replace(/\D/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          maxLength={10}
        />
        <TextInput
          style={styles.input}
          placeholder="Email (Optional)"
          value={formData.ownerEmail}
          onChangeText={(text) => handleInputChange('ownerEmail', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Your State *"
          value={formData.userState}
          onChangeText={(text) => handleInputChange('userState', text)}
        />
      </View>

      {/* Photos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Photos (Optional)</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
          <Ionicons name="camera" size={24} color="#2563eb" />
          <Text style={styles.uploadButtonText}>
            {images.length > 0 ? `Add More (${images.length}/8)` : 'Upload Photos'}
          </Text>
        </TouchableOpacity>
        {images.length > 0 && (
          <View style={styles.imageGrid}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Text style={styles.imageNumber}>{index + 1}</Text>
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, (submitting || uploading) && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting || uploading}
      >
        {submitting || uploading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Truck Details</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2563eb',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
    marginLeft: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageNumber: {
    fontSize: 12,
    color: '#6b7280',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 18,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
