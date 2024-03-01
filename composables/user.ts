export const useUser = () => {
  const user = useSupabaseUser();
  if (!user.value) return null;
  return computed( () => ({
    id: user.value?.id,
    email: user.value?.email,
    avatar: user.value?.user_metadata.avatar_url,
    full_name: user.value?.user_metadata.full_name,
  }));
};
