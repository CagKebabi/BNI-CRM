// API temel URL'si
// Development ortamında proxy kullanıyoruz, production'da doğrudan API URL'sini kullanacağız
// export const API_BASE_URL = import.meta.env.PROD ? 'http://92.205.61.102' : '/api';
export const API_BASE_URL = import.meta.env.PROD
  ? "https://api.inrest.co"
  : "/api";
// API endpoint'leri
export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/users/login/",
  // Users endpoints
  GET_USERS: "/users/users/",
  CREATE_USER: "/users/users/",
  UPDATE_USER: (id) => `/users/users/${id}/`,
  DELETE_USER: (id) => `/users/users/${id}/`,
  // Organization endpoints
  COUNTRIES: "/organization/countries/",
  UPDATE_COUNTRY: (id) => `/organization/countries/${id}/`,
  DELETE_COUNTRY: (id) => `/organization/countries/${id}/`,
  // Regions endpoints
  REGIONS: "/organization/regions/",
  CREATE_REGION: "/organization/regions/",
  UPDATE_REGION: (id) => `/organization/regions/${id}/`,
  DELETE_REGION: (id) => `/organization/regions/${id}/`,
  // Groups endpoints
  GROUPS: "/organization/groups/",
  CREATE_GROUP: "/organization/groups/",
  UPDATE_GROUP: (id) => `/organization/groups/${id}/`,
  DELETE_GROUP: (id) => `/organization/groups/${id}/`,
  // Roles endpoints
  GET_ROLES: "/organization/roles/",
  CREATE_ROLE: "/organization/roles/",
  UPDATE_ROLE: (id) => `/organization/roles/${id}/`,
  DELETE_ROLE: (id) => `/organization/roles/${id}/`,
  // Group Members endpoints
  GET_GROUP_MEMBERS: (id) => `/organization/groups/${id}/members/`,
  ADD_MEMBER_TO_GROUP: (groupId) =>
    `/organization/groups/${groupId}/add-member/`,
  UPDATE_GROUP_MEMBER: (id) => `/organization/groups/${id}/update-member-role/`,
  DELETE_MEMBER_ROLE: (id) => `/organization/groups/${id}/remove-member-role/`,
  GET_GROUP_LEADER_TEAM: (id) => `/organization/groups/${id}/leader-team/`,
  GET_GROUP_GOLD_MEMBERS: (id) => `/organization/groups/${id}/gold-members/`,
  // Visits endpoints
  GET_VISITS: (id) => `/visits/visitors/?group=${id}`,
  CREATE_VISIT: "/visits/visitors/",
  CREATE_VISITOR_NOTE: "/visits/visitor-notes/",
  UPDATE_VISIT: (id) => `/visits/visitors/${id}/`,
  DELETE_VISIT: (id) => `/visits/visitors/${id}/`,
  // Group Meetings endpoints
  GET_GROUP_MEETINGS: (groupId) => `/organization/meetings/?group=${groupId}`,
  SET_GROUP_MEETING: (groupId) => `/organization/groups/${groupId}/generate-meetings/`,
  // Open Categories endpoints
  GET_OPEN_CATEGORIES: (groupId) =>
    `/organization/groups/${groupId}/open-categories/`,
  CREATE_OPEN_CATEGORY: (id) => `/organization/groups/${id}/add-open-category/`,
  DELETE_OPEN_CATEGORY: (groupId, categoryId) =>
    `/organization/groups/${groupId}/remove-open-category/${categoryId}/`,
  // Presentations endpoints
  GET_PRESENTATIONS: (id) => `/organization/presentations/?group=${id}`,
  CREATE_PRESENTATION: "/organization/presentations/",
  UPDATE_PRESENTATION: (id) => `/organization/presentations/${id}/`,
  DELETE_PRESENTATION: (id) => `/organization/presentations/${id}/`,
  // Events endpoints
  GET_EVENTS: (groupId) => `/organization/events/?group=${groupId}`,
  CREATE_EVENT: "/organization/events/",
  UPDATE_EVENT: (id) => `/organization/events/${id}/`,
  DELETE_EVENT: (id) => `/organization/events/${id}/`,
};

// API istekleri için varsayılan ayarlar
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};
