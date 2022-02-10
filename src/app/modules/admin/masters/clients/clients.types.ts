export interface BusinessType {
    id: number;
    code: string;
    name: string;
    description: string;
    isActive: number
}

export interface Client
{
    id: number;
    name: string;
    description: string;
    isActive: number;
    businessType: BusinessType;
}
