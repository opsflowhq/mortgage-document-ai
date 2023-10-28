import ContentLoader from "react-content-loader";

export default function DocumentPageSkeleton() {
    return (
        <div className="mb-6 shadow-xl relative bg-white">
            <ContentLoader
                speed={2}
                width={1758}
                height={2275}
                viewBox="0 0 1758 2275"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                style={{maxWidth: 1758, minWidth: 700}}
                className="h-auto max-w-none w-full" 
            >
                    <path d="M 104 97 h 1549 v 82 H 104 z M 104 211 h 687 v 48 H 104 z M 104 291 h 1395 v 59 H 104 z M 104 382 h 1489 v 83 H 104 z M 104 497 h 369 v 57 H 104 z M 104 586 h 946 v 83 H 104 z M 104 701 h 1253 v 83 H 104 z M 104 816 h 1253 v 83 H 104 z M 104 931 h 779 v 83 H 104 z M 104 1046 h 1022 v 83 H 104 z M 104 1161 h 1290 v 83 H 104 z M 104 1276 h 1446 v 83 H 104 z M 104 1391 h 1446 v 83 H 104 z M 104 1506 h 274 v 59 H 104 z M 104 1597 h 1290 v 83 H 104 z M 104 1712 h 1395 v 59 H 104 z M 104 1803 h 946 v 83 H 104 z M 104 1918 h 1290 v 83 H 104 z M 104 2033 h 1290 v 83 H 104 z" />
            </ContentLoader>
        </div>
    );
}
