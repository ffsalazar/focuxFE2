import { Indicator } from '../indicators/indicators.types';
import { Objetive } from '../objetives/objetives.types';

export interface Evaluation {
    id: number;
    target: Objetive;
    indicator: Indicator;
    minimumPercentage: number;
    maximumPercentage: number;
    name: string;
    code: string;
    isActive: number;
}
