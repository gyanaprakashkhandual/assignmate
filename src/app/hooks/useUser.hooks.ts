import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
    fetchMe,
    updateMe,
    deleteMe,
    fetchLinkedProviders,
    unlinkProvider,
    logout,
    clearError,
} from "../lib/features/user/user.slice";
import {
    selectUser,
    selectIsAuthenticated,
    selectAuthLoading,
    selectAuthError,
    selectLinkedProviders,
    selectUserId,
    selectUserName,
    selectUserAvatar,
    selectIsProviderLinked,
} from "../lib/features/user/user.selector";
import { userApi } from "../lib/apis/user.api";
import { UpdateUserPayload } from "../lib/types/user.types";

export const useUser = () => {
    const dispatch = useAppDispatch();

    const user = useAppSelector(selectUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isLoading = useAppSelector(selectAuthLoading);
    const error = useAppSelector(selectAuthError);
    const providers = useAppSelector(selectLinkedProviders);
    const userId = useAppSelector(selectUserId);
    const userName = useAppSelector(selectUserName);
    const userAvatar = useAppSelector(selectUserAvatar);

    const refetchUser = () => dispatch(fetchMe());

    const update = (payload: UpdateUserPayload) => dispatch(updateMe(payload));

    const remove = () => dispatch(deleteMe());

    const loadProviders = () => dispatch(fetchLinkedProviders());

    const unlink = (provider: "google" | "github") => dispatch(unlinkProvider(provider));

    const signOut = async () => {
        await dispatch(logout());
        window.location.href = "/auth";
    };

    const loginWithGoogle = () => userApi.initiateGoogleAuth();

    const loginWithGithub = () => userApi.initiateGithubAuth();

    const dismissError = () => dispatch(clearError());

    const isGoogleLinked = useAppSelector(selectIsProviderLinked("google"));
    const isGithubLinked = useAppSelector(selectIsProviderLinked("github"));

    return {
        user,
        userId,
        userName,
        userAvatar,
        isAuthenticated,
        isLoading,
        error,
        providers,
        isGoogleLinked,
        isGithubLinked,
        refetchUser,
        update,
        remove,
        loadProviders,
        unlink,
        signOut,
        loginWithGoogle,
        loginWithGithub,
        dismissError,
    };
};