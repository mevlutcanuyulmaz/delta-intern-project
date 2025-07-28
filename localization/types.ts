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
  };
}