import GithubLogo from "@/assets/images/icons/github-logo";

interface HeaderBarProp {
    onCTAClick?: () => void;
}

export default function HeaderBar({ onCTAClick }: HeaderBarProp) {
    return (
        <header className="p-4 border-b sticky top-0 bg-white flex justify-between">
            <a href="https://www.mortgageflow.io" target="_blank" className="text-xl">
                <span className="font-bold">mortgage</span>
                <span>flow</span>
            </a>
            <a
                href="https://github.com/mortgageflow/mortgage-document-extractor"
                target="_blank"
                className="font-medium flex gap-2 items-center text-sm"
                onClick={onCTAClick}
            >
                {GithubLogo}
                <span>
                    Get source code
                </span>
            </a>
        </header>
    );
};