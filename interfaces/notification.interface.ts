export interface Notification {
    sender?: string;
    receiver: string;
    type?: string;
    content: string;
    is_read?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}