export interface Request {
    id: number,
    idCompany: number,
    idArea: number,
    typeRequest: any,
    titleRequest: string,
    descriptionRequest: string, // N
    responsibleRequest: any,
    priorityOrder: 1, // N
    dateRequest: Date,
    dateInit: Date,
    datePlanEnd: Date,
    dateRealEnd: Date,
    idStatus: number,
    completionPercentage: number,
    deviationPercentage: number, // N
    deliverablesCompletedIntelix: string, 
    pendingActivitiesIntelix: string,
    commentsIntelix: string,
    updateDate: Date,
    commentsClient: string,
    technicalArea: any,
    idCategory: number,
    internalFeedbackIntelix: string,
    idSolverGroup: number,
    idRequestPeriod: number,
    dateInitPause: Date,
    dateEndPause: Date,
    totalPauseDays: string,
    idCustomerBranch: number,
    isActive: number
}

export interface InventoryProduct
{
    id: string;
    category?: string;
    name: string;
    description?: string;
    tags?: string[];
    sku?: string | null;
    barcode?: string | null;
    brand?: string | null;
    vendor: string | null;
    stock: number;
    reserved: number;
    cost: number;
    basePrice: number;
    taxPercent: number;
    price: number;
    weight: number;
    thumbnail: string;
    images: string[];
    active: boolean;
}

export interface InventoryPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface InventoryCategory
{
    id: string;
    parentId: string;
    name: string;
    slug: string;
}

export interface InventoryBrand
{
    id: string;
    name: string;
    slug: string;
}

export interface InventoryTag
{
    id?: string;
    title?: string;
}

export interface InventoryVendor
{
    id: string;
    name: string;
    slug: string;
}
