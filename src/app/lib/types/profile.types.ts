export interface IHandwritingImage {
    url: string;
    publicId: string;
    uploadedAt: string;
}

export interface IProfile {
    _id: string;
    user: {
        _id: string;
        name: string;
        email?: string;
        avatar?: string;
    };
    username: string;
    nickname?: string;
    designation?: string;
    age?: number;
    handwritingImage?: IHandwritingImage;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProfilePayload {
    username: string;
    nickname?: string;
    designation?: string;
    age?: number;
}

export interface UpdateProfilePayload {
    username?: string;
    nickname?: string;
    designation?: string;
    age?: number;
}

export interface ProfileState {
    profile: IProfile | null;
    isLoading: boolean;
    error: string | null;
}