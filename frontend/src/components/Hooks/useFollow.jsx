import { followUnfollowUser } from "../../api/usersApi.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow } = useMutation({
    mutationFn: followUnfollowUser,

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  return { follow };
};

export default useFollow;