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
            {/* Main content */}
            <main className="max-w-2xl mx-auto px-6 pt-6 pb-6">
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