import { Objetive } from '../objetives/objetives.types';
import { Indicator } from '../indicators/indicators.types';

export interface Evaluation {
    id: number;
    objetive: Objetive;
    indicator: Indicator;
    minimumPercentage: number;
    maximumPercentage: number;
    name: string;
    code: string;
    isActive: number;
}
