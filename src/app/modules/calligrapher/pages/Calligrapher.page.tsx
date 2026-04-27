"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { PenLine, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCalligraphr } from "@/app/hooks/useCalligrapher";
import { setUploadedFile } from "@/app/lib/features/calligrapher/calligrapher.slice";
import StepIndicator from "../components/Step.indicator";
import Step1Download from "../steps/Download";
import Step2Upload from "../steps/Upload";
import Step3Complete from "../steps/Complete";

const pageVariants = {
    enter: (dir: number) => ({
        x:       dir > 0 ?  40 : -40,
        opacity: 0,
    }),
    center: {
        x:       0,
        opacity: 1,
        transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: (dir: number) => ({
        x:       dir > 0 ? -40 : 40,
        opacity: 0,
        transition: { duration: 0.25, ease: "easeIn" },
    }),
};

export default function CalligraphrPage() {
    const router   = useRouter();
    const dispatch = useDispatch();
    const {
        currentStep,
        uploadedFileUrl,
        fontUrl,
        isUploading,
        uploadProgress,
        error,
        previewSentence,
        handleDownloadTemplate,
        handleFileSelect,
        handleSheetUpload,
        handleFontUpload,
        handleReset,
    } = useCalligraphr();

    const direction = 1; // always forward in this linear flow

    const handleClearFile = () => {
        dispatch(setUploadedFile({ file: null as any, url: "" }));
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Top nav bar */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 dark:border-gray-900 bg-white/80 dark:bg-black/80 backdrop-blur-md">
                <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                            <PenLine size={14} className="text-white dark:text-black" />
                        </div>
                        <span className="text-sm font-semibold text-black dark:text-white tracking-tight">
                            Assignmate
                        </span>
                        <span className="text-gray-300 dark:text-gray-700 mx-1">/</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Handwriting Setup
                        </span>
                    </div>

                    {/* Close */}
                    <button
                        onClick={() => router.back()}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                    >
                        <X size={16} />
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-2xl mx-auto px-6 pt-28 pb-20">
                {/* Step indicator */}
                <div className="mb-12">
                    <StepIndicator currentStep={currentStep} />
                </div>

                {/* Step panels */}
                <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait" custom={direction}>
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                custom={direction}
                                variants={pageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                            >
                                <Step1Download onDownload={handleDownloadTemplate} />
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                custom={direction}
                                variants={pageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                            >
                                <Step2Upload
                                    uploadedFileUrl={uploadedFileUrl}
                                    isUploading={isUploading}
                                    uploadProgress={uploadProgress}
                                    error={error}
                                    onFileSelect={handleFileSelect}
                                    onSheetUpload={handleSheetUpload}
                                    onFontUpload={handleFontUpload}
                                    onClearFile={handleClearFile}
                                />
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                custom={direction}
                                variants={pageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                            >
                                <Step3Complete
                                    fontUrl={fontUrl}
                                    previewSentence={previewSentence}
                                    onReset={handleReset}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Bottom progress bar */}
            <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-900">
                <motion.div
                    className="h-full bg-black dark:bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
}