// Merkezi tip tanımları
export interface CompanyInfo {
  id: number;
  name: string;
  shortName: string;
  active: boolean;
  town?: Town;
  companyType?: {
    id: number;
    name: string;
    active: boolean;
  };
  addressDetail?: string;
  createdAt: string;
}

export interface DepartmentInfo {
  id?: number;
  name?: string;
  active?: boolean;
  companyId?: number;
  departmentTypeId?: number;
  townId?: number;
  addressDetail?: string;
  createdAt?: string;
  company?: { 
    id: number;
    name?: string;
    shortName?: string;
  };
  departmentType?: {
    id: number;
    name: string;
  };
  town?: DepartmentTownInfo;
}

// DepartmentDetailData interface for DepartmentDetail page
export interface DepartmentDetailData {
  id: number;
  name: string;
  addressDetail: string;
  company: {
    id: number;
    name: string;
    shortName: string;
  };
  town: DepartmentTownDetail;
  departmentType: {
    id: number;
    name: string;
  };
}

export interface DepartmentTownInfo {
  id: number;
  name: string;
  city?: City;
  region?: Region;
}

export interface DepartmentTownDetail {
  id: number;
  name: string;
  city: City;
  region: Region;
}

// UserStats interface for UserDashboard
export interface UserStats {
  departmentName: string;
  joinDate: string;
}

// DepartmentType interface
export interface DepartmentType {
  id: number;
  name: string;
}

export interface UserRole {
  id: number;
  name: string;
}

export interface UserInfo {
  id: number;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  company?: CompanyInfo;
  department?: DepartmentInfo;
  departmentName?: string; // API'den gelen departman adı
  departmentId?: number;
  companyId?: number; // Backend'den gelecek şirket ID'si
  role?: UserRole;
  createdAt?: string;
}

// Şehir/Bölge tipleri
export interface Region {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Town {
  id: number;
  name: string;
  region?: Region;
  city?: City;
  companyIds: number[];
  departmentIds: number[];
}

// Şirket türü
export interface CompanyType {
  id: number;
  name: string;
  active: boolean;
}

// API Response tipleri
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Form tipleri
export interface LoginForm {
  email: string;
  password: string;
}

export interface CompanyForm {
  name: string;
  shortName: string;
  addressDetail?: string;
  townId?: number;
  companyTypeId?: number;
}

export interface UserForm {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  roleId: number;
  departmentId?: number;
  companyId?: number;
}

// Location Form tipleri
export interface RegionForm {
  name: string;
}

export interface CityForm {
  name: string;
}

export interface TownForm {
  name: string;
  regionId?: number;
}