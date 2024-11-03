interface Timestamps {
    createdOn: string;
    modifiedOn: string | null;
    completedOn: string | null;
}

export interface Todo {
    id: string;
    title: string;
    description: string;
    cardColor: string;
    isCompleted: boolean;
    timestamps: Timestamps;
}
