import { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { X } from "lucide-react";

interface ImageUploaderProps {
    label?: string;
    value: File | string | null;
    onChange: (file: File | null) => void;
}

const ImageUploader = ({ label = "Upload Image", value, onChange }: ImageUploaderProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (typeof value === "string") {
            setPreviewUrl(value);
        } else if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [value]);

    return (
        <div className="w-full h-full flex flex-col gap-1">
            <Label htmlFor="image">{label}</Label>

            {!previewUrl ? (
                <div
                    className="w-full h-full border border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-primary transition"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <span className="text-sm text-gray-500">Click to upload</span>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(event) => {
                            const file = event.currentTarget.files?.[0];
                            if (file) {
                                onChange(file);
                            }
                        }}
                    />
                </div>
            ) : (
                <div className="relative w-full">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-auto rounded-md border"
                        onClick={() => fileInputRef.current?.click()}
                    />
                    <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full w-5 h-5 bg-white text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => {
                            onChange(null);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                            }
                        }}
                    >
                        <X className="w-2 h-2" />
                    </Button>
                </div>
            )}
        </div>
    );
};


export default ImageUploader;
