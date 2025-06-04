export interface IProvince {
    id: string;
    name: string;
    type: number;
    typeText: string;
    slug: string;
  }
  
  export const locationService = {
    async getProvinces(): Promise<IProvince[]> {
      const res = await fetch('https://open.oapi.vn/location/provinces?page=0&size=63');
      const data = await res.json();
      return data.data;
    }
  };