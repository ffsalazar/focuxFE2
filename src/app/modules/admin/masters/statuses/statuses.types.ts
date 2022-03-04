export interface TypeStatus {
    id: number;
    code: string;
    name: string;
    description: string;
    isActive: number
}

export interface Status
{
    id: number;
    name: string;
    description: string;
    isActive: number;
   typeStatus: string;
}
