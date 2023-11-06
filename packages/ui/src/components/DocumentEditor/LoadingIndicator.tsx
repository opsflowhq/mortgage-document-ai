import CircleLoader from "../UI/CircleLoader/CircleLoader";

export default function LoadingIndicator() {
    return (
        <div className="p-4 border-b flex gap-4 items-center">
            <div className="w-10">
                <CircleLoader />
            </div>
            <div>
                <div className="font-bold">
                    Processing document...
                </div>
                <div className="text-xs">
                    Document processing might take up to 40 seconds.
                </div>
            </div>
        </div>
    );
};