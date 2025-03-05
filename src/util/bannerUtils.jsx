export const getBannerModel = (farmacia) => {
    switch (farmacia) {
      case 1:
        return "banners";
      case 2:
        return "banners2";
      case 3:
        return "banners3";
      default:
        return "banners"; // Valor por defecto en caso de error
    }
  };