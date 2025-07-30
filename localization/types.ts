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
    logout: string;
  };
}