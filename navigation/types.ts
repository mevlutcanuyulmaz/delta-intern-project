export type RootStackParamList = {
  Login: undefined;
  AdminDashboard: undefined;
  CompanyList: undefined;
  CompanyForm: undefined;
  CreateCompany: undefined;
  UserList: undefined;
  UserForm: { userId?: number } | undefined;
  DepartmentTypeList: undefined;
  DepartmentTypeForm: { departmentTypeId?: number } | undefined;
  RegionList: undefined;
  RegionForm: { regionId?: number } | undefined;
  CityList: undefined;
  CityForm: { cityId?: number } | undefined;
  TownList: undefined;
  TownForm: { townId?: number } | undefined;
  Tabs: undefined;
  DepartmentList: undefined;
  DepartmentForm: undefined;
  DepartmentDetail: { departmentId: number };
  CompanyDetail: { id: number };
  ForgotPassword: undefined;
  Activation: undefined;
  UserDashboard: undefined;
  UserCompanyInfo: undefined;
  UserBottomTabs: undefined;
  ManagerDashboard: undefined;
  ManagerProfile: undefined;
  ManagerUserList: undefined;
  ManagerCompanyList: undefined;
  ManagerBottomTabs: undefined;
  
  
};
