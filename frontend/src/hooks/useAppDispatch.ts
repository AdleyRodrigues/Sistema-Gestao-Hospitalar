import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

// Hook personalizado para usar o dispatch tipado do Redux
export const useAppDispatch = () => useDispatch<AppDispatch>(); 