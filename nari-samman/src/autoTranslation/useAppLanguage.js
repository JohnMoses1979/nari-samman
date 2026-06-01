import useStore from '../store/useStore';
import { normalizeLanguage } from './translateText';

export default function useAppLanguage() {
  return useStore((state) => normalizeLanguage(state.language));
}