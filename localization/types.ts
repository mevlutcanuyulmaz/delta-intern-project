export interface Translations {
  // Auth translations
  auth: {
    login: {
      title: string;
      email: string;
      password: string;
      loginButton: string;
      forgotPassword: string;
      resetPassword: string;
      activateAccount: string;
      activate: string;
      loginError: string;
      checkCredentials: string;
      authError: string;
      roleNotDefined: string;
    };
    forgotPassword: {
      title: string;
      email: string;
      emailPlaceholder: string;
      sendButton: string;
      sendResetLink: string;
      backToLogin: string;
      resetLinkSent: string;
      checkEmail: string;
      error: string;
      tryAgain: string;
      infoTitle: string;
      infoMessage: string;
    };
    activation: {
      title: string;
      emailPlaceholder: string;
      sendButton: string;
      orText: string;
      tokenPlaceholder: string;
      activationCode: string;
      activateButton: string;
      backToLogin: string;
      activationSuccess: string;
      accountActivated: string;
      activationError: string;
      invalidCode: string;
      newPasswordPlaceholder: string;
      confirmPasswordPlaceholder:string;
      infoTitle: string;
      infoMessage: string;
    };
  };
  
  // User Dashboard translations
  userDashboard: {
    loading: string;
    welcome: string;
    myInfo: string;
    department: string;
    company: string;
    joinDate: string;
    email: string;
    unassigned: string;
    unknown: string;
    error: string;
    dataLoadError: string;
    dashboardDataError: string;
  };

  // User Profile translations
  userProfile: {
    loading: string;
    title: string;
    generalInfo: string;
    personalInfo: string;
    changePassword: string;
    department: string;
    company: string;
    role: string;
    joinDate: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    changePasswordButton: string;
    unassigned: string;
    unknown: string;
    logoutTitle: string;
    logoutMessage: string;
    cancel: string;
    logout: string;
    error: string;
    profileLoadError: string;
    fillAllFields: string;
    passwordMismatch: string;
    passwordMinLength: string;
    success: string;
    passwordChangeSuccess: string;
    passwordChangeError: string;
  };

  // User Company Info translations
  userCompanyInfo: {
    loading: string;
    error: string;
    retry: string;
    companyInfo: string;
    departmentInfo: string;
    noCompanyTitle: string;
    noCompanyText: string;
    noDepartmentTitle: string;
    noDepartmentText: string;
    active: string;
    departmentName: string;
    userRole: string;
    joinDate: string;
    notSpecified: string;
    companyName: string;
    companyCode: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    companyWebsite: string;
    establishedDate: string;
    employeeCount: string;
    companyType: string;
    user: string;
    email: string;
    role: string;
    name: string;
    surname: string;
    emailNotSpecified: string;
    roleNotSpecified: string;
    addressNotSpecified: string;
    inactive: string;
    defaultRole: string;
  };

  // Manager Dashboard translations
  managerDashboard: {
    loading: string;
    welcome: string;
    departmentStats: string;
    totalEmployees: string;
    managedDepartments: string;
    quickActions: string;
    departmentEmployees: string;
    companies: string;
    profileSettings: string;
    department: string;
    unknown: string;
    dataLoadError: string;
    error: string;
    dashboardDataError: string;
  };

  // Manager Profile translations
  managerProfile: {
    loading: string;
    title: string;
    generalInfo: string;
    personalInfo: string;
    changePassword: string;
    department: string;
    role: string;
    name: string;
    surname: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    changePasswordButton: string;
    passwordMismatch: string;
    passwordChangeSuccess: string;
    passwordChangeError: string;
    profileLoadError: string;
  };

  // Manager User List translations
  managerUserList: {
    loading: string;
    department: string;
    role: string;
    deleteUser: string;
    deleteConfirmation: string;
    cancel: string;
    delete: string;
    deleteSuccess: string;
    deleteError: string;
    emptyList: string;
    usersLoadError: string;
  };

  // Manager Company List translations
  managerCompanyList: {
    loading: string;
    title: string;
    companiesCount: string;
    active: string;
    inactive: string;
    companyType: string;
    district: string;
    city: string;
    region: string;
    address: string;
    createdDate: string;
    viewDetails: string;
    companiesLoadError: string;
  };

  // Admin Dashboard translations
  adminDashboard: {
    loading: string;
    welcome: string;
    systemStats: string;
    totalUsers: string;
    totalCompanies: string;
    totalDepartments: string;
    activeUsers: string;
    pendingUsers: string;
    dataLoadError: string;
    management: string;
    departmentTypes: string;
  };

  // Bottom Tabs translations
  bottomTabs: {
    admin: string;
    companies: string;
    users: string;
    home: string;
    profile: string;
    companyInfo: string;
  };

  // Admin User List translations
  adminUserList: {
    loading: string;
    addNewUser: string;
    edit: string;
    delete: string;
    deleteUser: string;
    deleteConfirmation: string;
    cancel: string;
    deleteSuccess: string;
    deleteError: string;
    usersLoadError: string;
    email: string;
    role: string;
    department: string;
    company: string;
  };

  // Admin User Form translations
  adminUserForm: {
    loading: string;
    name: string;
    surname: string;
    email: string;
    department: string;
    role: string;
    isActive: string;
    isActiveLabel: string;
    selectDepartment: string;
    save: string;
    warning: string;
    selectDepartmentWarning: string;
    saveSuccess: string;
    saveError: string;
    userLoadError: string;
    departmentsLoadError: string;
  };

  // Company List translations
  companyList: {
    loading: string;
    companiesLoadError: string;
    deleteSuccess: string;
    deleteError: string;
    addNewCompany: string;
    detail: string;
    edit: string;
    delete: string;
    district: string;
    city: string;
    region: string;
    address: string;
    notSpecified: string;
  };

  // Company Form translations
  companyForm: {
    loading: string;
    companyName: string;
    shortName: string;
    addressDetail: string;
    region: string;
    city: string;
    district: string;
    selectRegion: string;
    selectCity: string;
    selectDistrict: string;
    active: string;
    companyInfoError: string;
    regionsError: string;
    citiesError: string;
    allCitiesError: string;
    districtsError: string;
    allDistrictsError: string;
    districtDetailsError: string;
    updateSuccess: string;
    updateError: string;
  };

  // Create Company translations
  createCompany: {
    title: string;
    companyName: string;
    shortName: string;
    addressDetail: string;
    district: string;
    selectDistrict: string;
    companyType: string;
    selectCompanyType: string;
    active: string;
    create: string;
    missingInfo: string;
    enterCompanyNameAndShort: string;
    createSuccess: string;
    createError: string;
    districtsLoadError: string;
    companyTypesLoadError: string;
  };

  // Company Detail translations
  companyDetail: {
    title: string;
    departments: string;
  };

  // Department List translations
  departmentList: {
    title: string;
    addDepartment: string;
    detail: string;
    edit: string;
    delete: string;
    departmentsLoadError: string;
    districtsLoadError: string;
    departmentName: string;
    departmentNamePlaceholder: string;
    selectDistrict: string;
    selectDistrictPlaceholder: string;
    addressDetail: string;
    addressDetailPlaceholder: string;
    newDepartment: string;
    editDepartment: string;
    nameRequired: string;
    addressRequired: string;
    addSuccess: string;
    addError: string;
    updateSuccess: string;
    updateError: string;
    deleteError: string;
  };

  // Department Detail translations
  departmentDetail: {
    loading: string;
    departmentDetailsError: string;
    departmentUsersError: string;
    notFound: string;
    departmentInfo: string;
    departmentType: string;
    cityRegion: string;
    district: string;
    address: string;
    departmentManager: string;
    noManager: string;
    departmentEmployees: string;
    noEmployees: string;
  };

  // Department Type List translations
  departmentTypeList: {
    title: string;
    loading: string;
    addNewDepartmentType: string;
    edit: string;
    delete: string;
    deleteDepartmentType: string;
    deleteConfirmation: string;
    cancel: string;
    deleteSuccess: string;
    deleteError: string;
    departmentTypesLoadError: string;
    emptyList: string;
    departmentTypeName: string;
    active: string;
    inactive: string;
    status: string;
  };

  // Department Type Form translations
  departmentTypeForm: {
    title: string;
    editTitle: string;
    departmentTypeName: string;
    departmentTypeNamePlaceholder: string;
    isActive: string;
    isActiveLabel: string;
    save: string;
    loading: string;
    saveSuccess: string;
    saveError: string;
    departmentTypeLoadError: string;
    nameRequired: string;
  };

  // Company Type List translations
  companyTypeList: {
    title: string;
    loading: string;
    addNewCompanyType: string;
    edit: string;
    delete: string;
    deleteCompanyType: string;
    deleteConfirmation: string;
    cancel: string;
    deleteSuccess: string;
    deleteError: string;
    companyTypesLoadError: string;
    emptyList: string;
    companyTypeName: string;
    active: string;
    inactive: string;
    status: string;
  };

  // Company Type Form translations
  companyTypeForm: {
    title: string;
    editTitle: string;
    companyTypeName: string;
    companyTypeNamePlaceholder: string;
    isActive: string;
    isActiveLabel: string;
    save: string;
    loading: string;
    saveSuccess: string;
    saveError: string;
    companyTypeLoadError: string;
    nameRequired: string;
  };

  // Location Management translations
  locationManagement: {
    regionList: {
      title: string;
      loading: string;
      addNewRegion: string;
      edit: string;
      delete: string;
      deleteRegion: string;
      deleteConfirmation: string;
      cancel: string;
      deleteSuccess: string;
      deleteError: string;
      regionsLoadError: string;
      emptyList: string;
      regionName: string;
    };
    regionForm: {
      title: string;
      editTitle: string;
      regionName: string;
      regionNamePlaceholder: string;
      save: string;
      loading: string;
      saveSuccess: string;
      saveError: string;
      regionLoadError: string;
      nameRequired: string;
    };
    cityList: {
      title: string;
      loading: string;
      addNewCity: string;
      edit: string;
      delete: string;
      deleteCity: string;
      deleteConfirmation: string;
      cancel: string;
      deleteSuccess: string;
      deleteError: string;
      citiesLoadError: string;
      emptyList: string;
      cityName: string;
      region: string;
      deleteTitle: string;
    };
    cityForm: {
      title: string;
      editTitle: string;
      cityName: string;
      cityNamePlaceholder: string;
      region: string;
      selectRegion: string;
      save: string;
      loading: string;
      saveSuccess: string;
      saveError: string;
      cityLoadError: string;
      regionsLoadError: string;
      nameRequired: string;
      regionRequired: string;
    };
    townList: {
      title: string;
      loading: string;
      addNewTown: string;
      edit: string;
      delete: string;
      deleteTown: string;
      deleteTitle: string;
      deleteConfirmation: string;
      cancel: string;
      deleteSuccess: string;
      deleteError: string;
      townsLoadError: string;
      emptyList: string;
      townName: string;
      city: string;
      region: string;
    };
    townForm: {
      title: string;
      editTitle: string;
      townName: string;
      townNamePlaceholder: string;
      region: string;
      selectRegion: string;
      city: string;
      selectCity: string;
      save: string;
      loading: string;
      saveSuccess: string;
      updateSuccess: string;
      saveError: string;
      townLoadError: string;
      regionsLoadError: string;
      citiesLoadError: string;
      nameRequired: string;
    };
  };

  // Common translations
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    update: string;
    search: string;
    filter: string;
    refresh: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    confirm: string;
    yes: string;
    no: string;
    ok: string;
    logout: string;
    logoutError: string;
  };
}