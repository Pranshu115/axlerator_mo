// API service for backend communication
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-url.com/api';

export interface Truck {
  id: number;
  name: string;
  year: number;
  price: string;
  mileage: string;
  engine: string;
  transmission: string;
  location: string;
  image: string;
  certified: boolean;
  availability?: string;
  features?: string[];
  color?: string;
  owner?: string;
  images?: string[];
  manufacturer?: string;
  model?: string;
}

export interface TruckSubmission {
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  manufacturer: string;
  model: string;
  year: number;
  registrationNumber: string | null;
  kilometers: number;
  fuelType: string;
  transmission: string;
  ownerNumber: number;
  askingPrice: number;
  negotiable: boolean;
  location: string;
  state: string;
  city: string;
  description: string | null;
  images: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: 'Request failed' 
      }));
      throw new Error(error.error || error.message || 'Request failed');
    }

    return response.json();
  }

  async getTrucks(limit: number = 100): Promise<Truck[]> {
    const response = await this.request<{ trucks: Truck[] } | Truck[]>(
      `/trucks?limit=${limit}`
    );
    
    if (Array.isArray(response)) {
      return response;
    }
    return response.trucks || [];
  }

  async getTruckById(id: number): Promise<Truck> {
    return this.request<Truck>(`/trucks/${id}`);
  }

  async searchTrucks(query: string): Promise<Truck[]> {
    const response = await this.request<{ trucks: Truck[] } | Truck[]>(
      `/search?q=${encodeURIComponent(query)}`
    );
    
    if (Array.isArray(response)) {
      return response;
    }
    return response.trucks || [];
  }

  async getTruckSubmissions(status?: string): Promise<Truck[]> {
    const endpoint = status 
      ? `/truck-submissions?status=${status}`
      : '/truck-submissions';
    
    const response = await this.request<{ submissions: Truck[] } | Truck[]>(
      endpoint
    );
    
    if (Array.isArray(response)) {
      return response;
    }
    return response.submissions || [];
  }

  async submitTruck(data: TruckSubmission): Promise<{ success: boolean; message?: string }> {
    return this.request('/truck-submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async uploadImage(file: FormData): Promise<{ url: string }> {
    const url = `${API_BASE_URL}/upload-image`;
    const response = await fetch(url, {
      method: 'POST',
      body: file,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: 'Upload failed' 
      }));
      throw new Error(error.error || 'Failed to upload image');
    }

    return response.json();
  }

  async submitContact(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }): Promise<{ success: boolean }> {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();
