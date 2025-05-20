"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUpload } from "@/lib/context/upload-context";

export default function UploadPage() {
    const router = useRouter();
    const { setFile: setContextFile } = useUpload();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedBytes, setUploadedBytes] = useState("0kb");
    const [totalBytes, setTotalBytes] = useState("0MB");
    const [isUploadComplete, setIsUploadComplete] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropAreaRef = useRef<HTMLDivElement>(null);

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            processFile(droppedFile);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const processFile = (selectedFile: File) => {
        // Check file type
        const acceptedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
        if (!acceptedTypes.includes(selectedFile.type)) {
            alert('Please select a JPEG, PNG or MP4 file');
            return;
        }

        // Check file size (300MB max)
        const maxSize = 300 * 1024 * 1024; // 300MB in bytes
        if (selectedFile.size > maxSize) {
            alert('File size exceeds 300MB limit');
            return;
        }

        setFile(selectedFile);
        simulateUpload(selectedFile);
    };

    const simulateUpload = (selectedFile: File) => {
        setIsUploading(true);
        setUploadProgress(0);
        setTotalBytes((selectedFile.size / (1024 * 1024)).toFixed(1) + 'MB');
        setUploadedBytes('0kb');

        // Simulate upload progress
        const totalSize = selectedFile.size;
        const duration = 500; // 2 seconds for the upload simulation
        const interval = 100; // Update every 100ms
        const steps = duration / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const currentProgress = Math.min(currentStep / steps, 1);
            setUploadProgress(currentProgress * 100);

            const uploadedSize = Math.floor(currentProgress * totalSize);
            setUploadedBytes(`${Math.floor(uploadedSize / 1024)}kb`);

            const remaining = Math.ceil((steps - currentStep) * (interval / 1000));
            setTimeRemaining(`less than ${remaining} seconds`);

            if (currentStep >= steps) {
                clearInterval(timer);
                setIsUploadComplete(true);
                setTimeRemaining(null);
                
                // Save file to context instead of localStorage
                setContextFile(selectedFile);
            }
        }, interval);
    };

    const handleNext = () => {
        if (isUploadComplete && file) {
            // Navigate to the metadata page
            router.push('/metadata');
        }
    };

    return (
        <section className="bg-black text-white max-w-md mx-auto flex flex-col h-full">
            <div className="flex-1 p-4">
                <h2 className="text-3xl font-light mb-3">Select</h2>
                <div className="flex justify-between mb-2">
                    <div className="flex gap-1">
                        <div className="w-8 h-1 bg-white"></div>
                        <div className="w-2 h-1 bg-gray-500"></div>
                        <div className="w-2 h-1 bg-gray-500"></div>
                    </div>
                    <div className="text-xs">STEP 1/3</div>
                </div>

                <div className="mb-3">
                    <h3 className="text-lg font-light">Choose a file or drag & drop it here</h3>
                </div>

                <div
                    ref={dropAreaRef}
                    className={cn(
                        "border border-dashed border-gray-700 rounded-md bg-gray-900/50 h-32 flex flex-col items-center justify-center p-4 mb-4",
                        isUploading ? "opacity-50 pointer-events-none" : "cursor-pointer"
                    )}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={handleBrowseClick}
                >
                    {file ? (
                        <div className="text-center">
                            <p className="text-sm mb-1 break-all px-2">{file.name}</p>
                            <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(1)}MB</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-xs text-gray-400 mb-2 text-center">JPEG, PNG and MP4 formats, up to 300MB</p>
                            <Button
                                variant="ghost"
                                className="btn-purple text-white text-sm py-1 px-3"
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    handleBrowseClick();
                                }}
                            >
                                Browse files
                            </Button>
                        </>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/jpeg,image/png,video/mp4"
                    />
                </div>

                {/* Uploading section */}
                {(isUploading || isUploadComplete) && (
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-light">Uploading</h3>
                        </div>

                        <div className="mb-1 flex justify-between items-center text-sm">
                            <div>{uploadedBytes} of {totalBytes}</div>
                            {timeRemaining && <div className="text-xs text-gray-400">{timeRemaining}</div>}
                        </div>

                        <div className="relative h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="absolute left-0 top-0 h-full bg-purple-card transition-all"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer with Next button */}
            <div className="p-4 ">
                <Button
                    className={cn(
                        "w-full bg-cyberdeus-purple-dark hover:bg-cyberdeus-purple h-12 rounded-md text-sm",
                        !isUploadComplete && "opacity-50 pointer-events-none"
                    )}
                    disabled={!isUploadComplete}
                    onClick={handleNext}
                >
                    NEXT <span className="ml-1">›</span>
                </Button>
            </div>
        </section>
    );
}