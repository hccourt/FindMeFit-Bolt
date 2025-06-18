// Add this useEffect to DiscoverPage
useEffect(() => {
  if (currentLocation) {
    fetchClasses();
  }
}, [currentLocation?.id, fetchClasses]);
