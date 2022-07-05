export interface UserProfileResponse {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    firstname: string;
    lastname: string;
    followers: unknown[];
    followeds: unknown[];
    tweets: unknown[];
}