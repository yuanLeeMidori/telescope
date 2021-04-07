import { Props } from 'material-ui-popup-state';
import { createContext, useContext, useReducer } from 'react';

const BannerContext = createContext();

const BannerReducer = (state: any, action: { type: any }) => {
  switch (action.type) {
    case 'BANNER_IS_VISIBLE':
      return {
        IsVisible: !state.IsVisible,
      };
    default:
      return state;
  }
};

const useBanner = () => {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error('useBanner must be used with a BannerProvider');
  }
  return context;
};

const BannerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BannerReducer, { IsVisible: true });
  const value = { state, dispatch };
  return <BannerContext.Provider value={value}>{children}</BannerContext.Provider>;
};

export { BannerProvider, useBanner };
