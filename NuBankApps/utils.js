import { Platform, PixelRatio } from "react-native";

export function getPixelSize(pixels) {
  return Platform.select({
    ios: pixels,
    android: PixelRatio.getPixelSizeForLayoutSize(pixels)
  });
}



export function umNome(name) {
  return name.split(" ")[0]
}
