export type DatasetServiceCreateItemDto = {
    pixels: number[];
    value: number;
};

export type DatasetServiceUpdateItemDto = {
    id: string;
} & Partial<DatasetServiceCreateItemDto>;

export type DatasetServiceDeleteItemDto = {
    id: string;
};
