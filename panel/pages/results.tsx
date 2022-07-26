import { trpc } from "../trpc";

export default function IndexPage() {
    // const { mutateAsync: sendMessageMutation } = trpc.useMutation(["action.dispatch"]);

    // trpc.useSubscription(["action.onDispatched"], {
    //     onNext(action) {
    //         console.log("!!!", action);
    //         //   addMessages([post]);
    //     },
    //     onError(err) {
    //         console.error("Subscription error:", err);
    //         // we might have missed a message - invalidate cache
    //         //   utils.queryClient.invalidateQueries();
    //     }
    // });

    return (
        <div>
            <h2 className="text-2xl uppercase font-semibold">Results</h2>
            <button>Send Action</button>
        </div>
    );
}
