export const ACCOUNT_FIELD_CONFIG = {
  NNR: {
    showDeclaringFor: false,
  },
  CARGO: {
    showDeclaringFor: false,
  },
  LINEHAUL: {
    showDeclaringFor: false,
  },
  LOGWIN: {
    showDeclaringFor: false,
  },
  SGL: {
    showDeclaringFor: false,
  },
  DEFAULT: {
    showDeclaringFor: true,
  },
};

export const getFieldConfig = (accountId) => {
  return ACCOUNT_FIELD_CONFIG[accountId] ?? ACCOUNT_FIELD_CONFIG["DEFAULT"];
};
