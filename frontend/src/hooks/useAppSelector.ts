import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store';

// Hook personalizado para usar o selector tipado do Redux
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 