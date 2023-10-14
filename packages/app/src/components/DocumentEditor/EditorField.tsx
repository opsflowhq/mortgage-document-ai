import { Page } from "@urla1003/types";


interface EditorFieldProps {
    label: string;
    value?: string | null;
}

export default function DocumentField({label, value}: EditorFieldProps) {
    return (
        <div className="flex flex-row h-12 bg-white px-4 hover:bg-purple-200">
            <div className=" flex items-center justify-center pr-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            </div>
            <div className="flex items-center">
                {label}
            </div>
            <div className="flex items-center grow justify-end">
                {value}
            </div>
        </div>
    );
}