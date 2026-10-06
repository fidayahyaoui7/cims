import { tunisiaRegions } from '../data/tunisiaHospitals';

export const getRegions = () => {
  return tunisiaRegions.map(region => ({
    id: region.id,
    name: region.name,
    hospitalCount: region.hospitals.length
  }));
};

export const getHospitalsByRegion = (regionId) => {
  const region = tunisiaRegions.find(r => r.id === regionId);
  return region ? region.hospitals : [];
};

export const searchHospitals = (query) => {
  const lowerQuery = query.toLowerCase();
  const results = [];
  
  tunisiaRegions.forEach(region => {
    region.hospitals.forEach(hospital => {
      if (
        hospital.name.toLowerCase().includes(lowerQuery) ||
        hospital.city.toLowerCase().includes(lowerQuery) ||
        hospital.address.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          ...hospital,
          region: region.name,
          regionId: region.id
        });
      }
    });
  });
  
  return results;
};

export const getHospitalById = (hospitalId) => {
  for (const region of tunisiaRegions) {
    const hospital = region.hospitals.find(h => h.id === hospitalId);
    if (hospital) {
      return {
        ...hospital,
        region: region.name,
        regionId: region.id
      };
    }
  }
  return null;
};
