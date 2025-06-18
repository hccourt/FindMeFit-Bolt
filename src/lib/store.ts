// Update the setLocation action in useLocationStore
setLocation: (location) => {
  set({ currentLocation: location });
  get().addRecentLocation(location);
  // Force refresh classes when location changes
  useClassStore.getState().forceRefreshClasses();
},
